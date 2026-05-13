# Contexto para Agentes (AGENTS.md)

Este documento descreve a arquitetura, o propósito e as diretrizes de desenvolvimento da aplicação **Placar Codeforces - Maratona Feminina de Programação**, servindo como guia de referência rápida para agentes de IA e desenvolvedores que atuem na manutenção ou evolução deste repositório.

---

## 🎯 Propósito da Aplicação

O projeto é um **sistema de placar (standings) customizado e em tempo real** desenvolvido para exibir os resultados da **Maratona Feminina de Programação**. 

Ele consome os dados da API oficial do **Codeforces** de forma segura através de uma rota de backend (`/placar`), oferecendo uma experiência visual aprimorada, moderna e focada nas necessidades do evento, com recursos como:
- **Cores de Balões Personalizadas**: Mapeamento de cores específicas para cada problema do contest.
- **Destaque de *First to Solve* (First Blood)**: Identificação visual com uma estrela para o time que resolveu o problema primeiro.
- **Filtro de Sede Local**: Capacidade de alternar instantaneamente entre o placar **Geral** e o placar focado nos times de uma **Sede Local** específica (ex: UFS).
- **Suporte a Temas**: Interface adaptável com alternância fluida entre Modo Claro e Modo Escuro (Dark Mode).

---

## 🛠️ Stack Tecnológica e Arquitetura

A aplicação segue uma arquitetura **Full-Stack** construída com as seguintes tecnologias:

- **Framework Full-Stack**: [Nuxt 3](https://nuxt.com/) utilizando a *Composition API* do Vue.js 3 e a sintaxe `<script setup>`.
- **Backend / Rota de Servidor**: Endpoint `/placar` servido pelo motor Nitro do Nuxt em ambiente Node.js para encapsular chaves privadas.
- **Roteamento**: Roteamento baseado em arquivos nativo do Nuxt (`src/pages/`).
- **Estilização e Design System**: [Tailwind CSS v4](https://tailwindcss.com/) com suporte nativo a transições suaves e dark mode customizado.
- **Ícones**: [@lucide/vue](https://lucide.dev/) para iconografia vetorial limpa e leve.
- **Qualidade de Código**: Configurado com ESLint, Prettier e Oxlint para garantir consistência e padronização.

---

## 📂 Estrutura do Repositório e Componentes Principais

```text
server/
└── routes/             # Rotas literais de servidor (Nitro)
    └── placar.js       # Rota segura que consome a API do Codeforces gerando `apiSig`
src/
├── assets/             # Imagens estáticas e logos (ex: logo-mfp.png)
├── components/         # Componentes reutilizáveis da interface
│   ├── AppHeader.vue   # Cabeçalho global com título e seletor de tema
│   ├── AppFooter.vue   # Rodapé da aplicação
│   ├── BalaoIcone.vue  # Renderizador do ícone de balão, tentativas, tempo e First Blood
│   ├── PlacarTabela.vue# Tabela principal de classificação e listagem dos times
│   ├── ThemeToggle.vue # Controle de alternância de tema (Light/Dark)
│   └── ToggleButton.vue# Botão de filtro para alternar entre Placar Geral e Sede
├── pages/              # Páginas da aplicação com roteamento automático
│   ├── index.vue       # Placar principal com listagem e filtros
│   └── admin.vue       # Página de administração
├── utils/              # Lógicas de serviço e processamento de dados
│   ├── api.js          # Consome a rota local `/placar` a partir do frontend
│   └── parser.js       # Transformação dos dados em estruturas otimizadas para a UI
├── app.vue             # Componente raiz estrutural do Nuxt
└── config.json         # Configurações estáticas do contest (cores de balões e mapeamento da sede local)
```

### Detalhes de Implementação Relevantes

1. **Segurança e Autenticação na API do Codeforces (`server/routes/placar.js`)**:
   - A comunicação direta com a API do Codeforces ocorre inteiramente no **lado do servidor**, impedindo o vazamento de chaves sensíveis.
   - O cálculo da assinatura (`apiSig`) usando hash **SHA-512** é feito nativamente no servidor utilizando a Web Crypto API do Node.js (`crypto.subtle.digest`).
   - As credenciais (`API_KEY`, `API_SECRET`, `CONTEST_ID`, `GROUP_CODE`) devem ser fornecidas via variáveis de ambiente (`.env`) e são lidas de forma segura através do `process.env`.

2. **Parser e Lógica de Negócio (`src/utils/parser.js`)**:
   - Extrai as submissões e identifica o menor tempo aceito para cada problema para atribuir a flag de *first blood*.
   - Mapeia os membros de cada time contra os handles listados em `config.json` para marcar se o time pertence à sede local.
   - Calcula tentativas rejeitadas e o tempo formatado em minutos para exibição correta dentro dos balões.

---

## 🤖 Diretrizes para Agentes de IA

Ao realizar modificações ou adicionar novas funcionalidades neste repositório, siga estritamente as regras abaixo:

- **Arquitetura Nuxt**: Respeite as convenções de diretórios do Nuxt 3 (como o diretório configurado `src/pages/` e roteamento automático).
- **Segurança das Credenciais**: Sob nenhuma hipótese exponha variáveis como `API_KEY` ou `API_SECRET` ao frontend ou no `nuxt.config.ts`.
- **Preservação da Reatividade**: Utilize sempre `ref` e `computed` do Vue 3 de forma correta, evitando mutações diretas indesejadas em propriedades computadas.
- **Estilização Consistente**: Mantenha o padrão de classes do Tailwind CSS já estabelecido, respeitando as classes de prefixo `m-` e o tema global.
