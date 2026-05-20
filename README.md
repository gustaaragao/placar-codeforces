<div align="center">
  <h1>🎈 Placar Codeforces</h1>
  <p>Sistema de placar em tempo real para contest's do Codeforces inspirado no placar do [Boca](https://github.com/cassiopc/boca)</p>
</div>

---

## 📖 Sobre o Projeto

Placar customizado e em tempo real que consome a API do **Codeforces** de forma segura, oferecendo:

- 🎈 **Balões coloridos**: com mapeamento customizável por problema
- ⭐ **First Accepted**: destaque para quem resolve cada problema primeiro
- 🏅 **Sistema de medalhas**: por divisão (Geral, Universidade X, Ensino Médio)
- 🏠 **Filtro de Sede Local**: alterne entre o placar geral e os times da sua sede
- 🌍 **Internacionalização (i18n):** suporte nativo para Português, Inglês e Espanhol
- 🔄 **Atualização automática** a cada 60 segundos
- 🌙 **Dark Mode**

> **⚠️ Aviso Importante:** Esta aplicação oferece suporte **exclusivo** a contests que pertencem a um grupo no Codeforces no qual você possui privilégios de **Manager**. Quaisquer outros cenários ou tipos de contests não são suportados pelo sistema.

---

## 🛠️ Pré-requisitos

| Ferramenta                  | Versão mínima             |
| --------------------------- | ------------------------- |
| Node.js                     | `^20.19.0` ou `>=22.12.0` |
| npm                         | `>=10`                    |
| Docker _(opcional)_         | qualquer versão recente   |
| Docker Compose _(opcional)_ | v2+                       |

---

## ⚙️ Configuração do Ambiente

### 1. Variáveis de Ambiente (`.env`)

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o `.env` com os dados do seu contest:

```dotenv
# Credenciais do Codeforces. Disponível em: https://codeforces.com/settings/api
API_KEY=sua_api_key
API_SECRET=seu_api_secret

# Dados do Group e Contest do Codeforces
# A url tem o seguinte formato: https://codeforces.com/group/{GROUP_CODE}/contest/{CONTEST_ID}
GROUP_CODE=codigo_do_grupo
CONTEST_ID=id_do_contest
```

---

### 2. Configuração do Contest (`src/config.json`)

O arquivo `src/config.json` é o único arquivo que você precisa editar para adaptar o sistema ao seu evento. Ele contém três seções principais:

#### 2.1 Evento (`evento`)

Configura a identidade visual ("white label") do seu placar, incluindo nome da competição, ícone e cor de destaque do título.

```json
"evento": {
  "nome": "Maratona Feminina de Programação",
  "icone": "/logo-mfp.png",
  "corBase": "text-m-primary-600 dark:text-m-primary-500"
}
```

| Campo     | Tipo     | Descrição                                                                                                                                                                        |
| --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nome`    | `string` | Nome da sua competição, exibido no cabeçalho e no título da página (aba do navegador)                                                                                            |
| `icone`   | `string` | Caminho para o logo/ícone do evento (ex: coloque a imagem na pasta `public/` e referencie como `/imagem.png`). É exibido no cabeçalho e também utilizado como favicon. Opcional. |
| `corBase` | `string` | Classes do Tailwind CSS que definem a cor do título do evento no cabeçalho                                                                                                       |

#### 2.2 Balões (`baloes`)

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

| Campo  | Tipo           | Descrição                                        |
| ------ | -------------- | ------------------------------------------------ |
| `"A"`  | chave          | Letra do problema no contest (A, B, C…)          |
| `cor`  | `string` (hex) | Cor hexadecimal do balão físico                  |
| `nome` | `string`       | Nome descritivo da cor (exibido no painel admin) |

#### 2.3 Sedes Locais (`sedesLocais`)

Configura um array contendo todas as sedes que participam do seu evento. Isso permite alternar entre elas no placar, visualizar painéis administrativos individuais de balões para cada sede e gerenciar times filtrados por local.

```json
"sedesLocais": [
  {
    "nome": "Sede Aracaju",
    "instituicao": "UFS - Campus São Cristóvão",
    "divisoes": {
      "UFS": { "label": "UFS" },
      "EM": { "label": "Ensino Médio" }
    },
    "participantes": {
      "handle-codeforces": {
        "nome": "Nome Completo",
        "divisao": "UFS",
        "laboratorio": "D1",
        "instituicao": "Universidade Federal de Sergipe"
      },
      "outro-handle": {
        "nome": "Outro Nome",
        "divisao": "EM",
        "laboratorio": "D2",
        "instituicao": "Colégio de Aplicação (CODAP)"
      }
    }
  }
]
```

| Campo                               | Tipo     | Descrição                                                                                      |
| ----------------------------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `nome`                              | `string` | Nome da sede (exibido no seletor de sedes do placar)                                           |
| `instituicao`                       | `string` | Nome global padrão da sede (usado se o participante não tiver uma instituição própria)         |
| `divisoes`                          | `object` | Categorias do evento. A chave é o ID interno e `label` é o rótulo exibido na medalha           |
| `participantes`                     | `object` | Mapeamento de `handle do Codeforces` → dados da participante                                   |
| `participantes[handle].nome`        | `string` | Nome real do competidor                                                                        |
| `participantes[handle].divisao`     | `string` | (Opcional) Deve corresponder a uma chave em `divisoes` (ex: `"UFS"` ou `"EM"`)                 |
| `participantes[handle].laboratorio` | `string` | (Opcional) Sala/Laboratório onde o competidor está (útil para o painel de entrega de balões)   |
| `participantes[handle].instituicao` | `string` | (Opcional) Instituição de ensino específica que o competidor representa (sobrescreve a global) |

**Como o sistema de medalhas funciona:**

O sistema calcula automaticamente 3 categorias de ranking a partir dos times detectados como locais:

- 🏅 **Geral** — top 3 entre _todos_ os times locais
- 🏅 **por Divisão** — top 3 dentro de cada divisão configurada (ex: UFS, EM)

Um mesmo competidor pode receber medalhas em múltiplas categorias (ex: 🥇 Geral + 🥇 UFS). As medalhas aparecem apenas ao ativar o filtro **"Sede"** no placar.

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

| Comando           | Descrição                                           |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento com HMR        |
| `npm run build`   | Gera o bundle de produção em `.output/`             |
| `npm run preview` | Pré-visualiza o build de produção localmente        |
| `npm run lint`    | Executa `oxlint` + `eslint` com correção automática |
| `npm run format`  | Formata o código com Prettier                       |

---

## 🐳 Deploy com Docker

### Docker Compose (recomendado)

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

---

## 📂 Estrutura do Projeto

```
server/
└── routes/placar.js    # Rota segura que consome a API do Codeforces
src/
├── assets/             # Imagens e estilos globais
├── components/
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

## 🤝 Desenvolvido por

**LAWD UFS** — [Instagram](https://instagram.com/lawd.ufs)
**Greedy UFS** — [Instagram](https://instagram.com/greedy-ufs)
