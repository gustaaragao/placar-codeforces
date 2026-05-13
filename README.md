<div align="center">
  <h1>🎈 Placar Codeforces</h1>
  <p>Sistema de placar em tempo real para a <strong>Maratona Feminina de Programação</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Nuxt-3-00DC82?style=flat&logo=nuxt.js" alt="Nuxt 3"/>
    <img src="https://img.shields.io/badge/Vue-3-42b883?style=flat&logo=vue.js" alt="Vue 3"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat&logo=tailwindcss" alt="Tailwind CSS v4"/>
    <img src="https://img.shields.io/badge/Docker-ready-2496ED?style=flat&logo=docker" alt="Docker"/>
  </p>
</div>

---

## 📖 Sobre o Projeto

Placar customizado e em tempo real que consome a API do **Codeforces** de forma segura, oferecendo:

- 🎈 **Balões coloridos** com mapeamento customizável por problema
- ⭐ **First Blood** — destaque para quem resolve cada problema primeiro
- 🏅 **Sistema de medalhas** por divisão (Geral, UFS, Ensino Médio)
- 🏠 **Filtro de Sede Local** — alterne entre o placar geral e os times da sua sede
- 🌙 **Dark Mode** com alternância fluida
- 🔄 **Atualização automática** a cada 15 segundos

---

## 🛠️ Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| Node.js | `^20.19.0` ou `>=22.12.0` |
| npm | `>=10` |
| Docker *(opcional)* | qualquer versão recente |
| Docker Compose *(opcional)* | v2+ |

---

## ⚙️ Configuração do Ambiente

### 1. Variáveis de Ambiente (`.env`)

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o `.env` com os dados do seu contest:

```dotenv
# Credenciais do Codeforces — https://codeforces.com/settings/api
API_KEY=sua_api_key
API_SECRET=seu_api_secret

# Dados do contest
# URL do format: https://codeforces.com/group/{GROUP_CODE}/contest/{CONTEST_ID}
GROUP_CODE=codigo_do_grupo
CONTEST_ID=id_do_contest
```

> **Importante:** O `.env` nunca deve ser commitado. Ele já está no `.gitignore`.

---

### 2. Configuração do Contest (`src/config.json`)

O arquivo `src/config.json` é o único arquivo que você precisa editar para adaptar o sistema ao seu evento. Ele contém duas seções principais:

#### 2.1 Balões (`baloes`)

Mapeie a letra de cada problema à cor e ao nome do balão correspondente. Isso controla a cor exibida no placar e no painel de administração.

```json
"baloes": {
  "A": {
    "cor": "#34d399",
    "nome": "verde"
  },
  "B": {
    "cor": "#f472b6",
    "nome": "rosa"
  }
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `"A"` | chave | Letra do problema no contest (A, B, C…) |
| `cor` | `string` (hex) | Cor hexadecimal do balão físico |
| `nome` | `string` | Nome descritivo da cor (exibido no painel admin) |

> **Dica:** Use o site [coolors.co](https://coolors.co) ou qualquer color picker para escolher o hex correto.

#### 2.2 Sede Local (`sedeLocal`)

Configura os times e participantes da sua sede para o placar filtrado e o sistema de medalhas.

```json
"sedeLocal": {
  "instituicao": "UFS",
  "divisoes": {
    "UFS": { "label": "UFS" },
    "EM": { "label": "Ensino Médio" }
  },
  "participantes": {
    "handle-codeforces": { "nome": "Nome Completo", "divisao": "UFS" },
    "outro-handle": { "nome": "Outro Nome", "divisao": "EM" }
  }
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `instituicao` | `string` | Nome da sede exibido abaixo do nome do time |
| `divisoes` | `object` | Categorias do evento. A chave é o ID interno e `label` é o rótulo exibido na medalha |
| `participantes` | `object` | Mapeamento de `handle do Codeforces` → dados da participante |
| `participantes[handle].nome` | `string` | Nome real da competidora |
| `participantes[handle].divisao` | `string` | Deve corresponder a uma chave em `divisoes` (ex: `"UFS"` ou `"EM"`) |

**Como o sistema de medalhas funciona:**

O sistema calcula automaticamente 3 categorias de ranking a partir dos times detectados como locais:

- 🏅 **Geral** — top 3 entre *todos* os times locais
- 🏅 **por Divisão** — top 3 dentro de cada divisão configurada (ex: UFS, EM)

Uma mesma competidora pode receber medalhas em múltiplas categorias (ex: 🥇 Geral + 🥇 UFS). As medalhas aparecem apenas ao ativar o filtro **"Sede"** no placar.

---

## 🚀 Executando Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/gustaaragao/placar-codeforces.git
cd placar-codeforces

# 2. Instale as dependências
npm install

# 3. Configure o ambiente (veja a seção acima)
cp .env.example .env
# edite o .env com suas credenciais

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em: **http://localhost:3000**

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento com HMR |
| `npm run build` | Gera o bundle de produção em `.output/` |
| `npm run preview` | Pré-visualiza o build de produção localmente |
| `npm run lint` | Executa `oxlint` + `eslint` com correção automática |
| `npm run format` | Formata o código com Prettier |

---

## 🐳 Deploy com Docker

### Opção 1 — Docker Compose (recomendado)

```bash
# 1. Garanta que o .env está preenchido
cp .env.example .env
# edite o .env

# 2. Build e subir o container
docker compose up -d

# 3. Acompanhar os logs
docker compose logs -f

# 4. Parar o serviço
docker compose down
```

A aplicação ficará disponível em **http://localhost:3000**.

### Opção 2 — Docker Manual

```bash
# Build da imagem
docker build -t placar-mfp:latest .

# Rodar o container passando o .env
docker run -d \
  --name placar-mfp \
  --env-file .env \
  -p 3000:3000 \
  placar-mfp:latest
```

### Sobre a imagem Docker

O `Dockerfile` usa um **build multi-stage** para garantir uma imagem final mínima (~55 MB):

```
Stage 1 (deps)     → instala node_modules
Stage 2 (builder)  → executa npm run build → gera .output/
Stage 3 (runner)   → copia apenas .output/ — sem código-fonte
```

---

## 📂 Estrutura do Projeto

```
server/
└── routes/placar.js    # Rota segura que consome a API do Codeforces
src/
├── assets/             # Imagens e estilos globais
├── components/
│   ├── AppHeader.vue   # Cabeçalho com navegação e tema
│   ├── AppFooter.vue   # Rodapé com créditos e links
│   ├── BalaoIcone.vue  # Ícone de balão com animações
│   ├── PlacarTabela.vue# Tabela principal de classificação
│   ├── ThemeToggle.vue # Alternância Light/Dark Mode
│   └── ToggleButton.vue# Filtro Geral/Sede
├── pages/
│   ├── index.vue       # Placar principal
│   └── admin.vue       # Painel de controle de entregas de balões
├── utils/
│   ├── api.js          # Fetch da rota local /placar
│   └── parser.js       # Transforma os dados do Codeforces para a UI
├── app.vue             # Componente raiz
└── config.json         # ⚙️ Configuração do contest (balões e sede local)
```

---

## 🔐 Segurança

As credenciais da API do Codeforces (`API_KEY`, `API_SECRET`) são manipuladas **exclusivamente no servidor** (rota Nitro em `server/routes/placar.js`). O frontend nunca tem acesso a essas chaves.

---

## 🤝 Desenvolvido por

**Greedy UFS** — [Instagram](https://instagram.com/greedy-ufs) · [GitHub](https://github.com/gustaaragao/placar-codeforces)
