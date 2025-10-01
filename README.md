# 🖼️ Remove BG Images

Um site simples e moderno que permite remover o **fundo de imagens automaticamente**.
Construído com **React + Vite + TailwindCSS**, utilizando a biblioteca [`@imgly/background-removal`](https://www.npmjs.com/package/@imgly/background-removal) para processar as imagens.

---

## ✨ Funcionalidades

* Upload de imagens direto do navegador
* Remoção automática de fundo
* Interface responsiva e moderna com **TailwindCSS**
* Animações fluidas com **GSAP**
* Ícones bonitos com **Heroicons** e **Lucide**

---

## 🛠️ Tecnologias e Dependências

* [React 19](https://react.dev/) + [React DOM](https://react.dev/reference/react-dom)
* [Vite](https://vitejs.dev/) (build rápido e moderno)
* [TailwindCSS](https://tailwindcss.com/) + [@tailwindcss/vite](https://tailwindcss.com/docs/guides/vite)
* [@imgly/background-removal](https://www.npmjs.com/package/@imgly/background-removal) (remoção de fundo)
* [GSAP](https://gsap.com/) (animações)
* [Headless UI](https://headlessui.dev/) (componentes acessíveis)
* [Heroicons](https://heroicons.com/) + [Lucide React](https://lucide.dev/)

---

## 🚀 Como rodar localmente

### Pré-requisitos

* [Node.js](https://nodejs.org/) 18+
* [npm](https://www.npmjs.com/) ou [pnpm](https://pnpm.io/)

### Passos

```bash
# Clone o repositório
git clone https://github.com/user2510s/sparkapps-bg.git

# Entre na pasta
cd remove-bg-site

# Instale as dependências
npm install
# ou
pnpm install

# Rode em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Pré-visualizar build
npm run preview
```

---

## 📂 Estrutura do Projeto

```
remove-bg-site/
├── public/            # arquivos estáticos
├── src/
│   ├── components/    # componentes React
│   ├── pages/         # páginas do site
│   ├── styles/        # estilos globais
│   └── main.tsx       # ponto de entrada
├── package.json
└── vite.config.ts
```

---

