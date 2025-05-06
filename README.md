# Netflix Clone 🎬

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![API: TMDB](https://img.shields.io/badge/API-TMDB-01d277?style=flat-square&logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/)
[![Styling: Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

Um clone completo da interface da Netflix, desenvolvido com React, Express e TMDB API. Este projeto recria fielmente a experiência visual e de navegação da plataforma Netflix.

![Netflix Clone Screenshot](client/public/assets/images%20(9).jpg)

## 🌟 Características

- **Design Responsivo**: Interface adaptável para todos os dispositivos (desktop, tablet e mobile)
- **Navegação Autêntica**: Replicação precisa do sistema de navegação da Netflix
- **Gerenciamento de Perfis**: Sistema completo com múltiplos perfis e avatares personalizados
- **Conteúdo Real**: Integração com TMDB API para exibição de filmes e séries atuais
- **Categorias Dinâmicas**: Exibição de conteúdo organizado por categorias
- **UI/UX Autêntico**: Recriação fiel dos elementos visuais da Netflix:
  - Hero section com destaque para conteúdo selecionado
  - Carrosséis de conteúdo com navegação horizontal
  - Cards com animação de zoom e detalhes ao passar o mouse
  - Seção Top 10 com numeração estilizada
  - Barra de navegação dinâmica

## 🛠️ Tecnologias Utilizadas

- **Frontend**:
  - React
  - TypeScript
  - Tailwind CSS
  - Radix UI / Shadcn Components
  - React Query
  - React Router (Wouter)

- **Backend**:
  - Node.js
  - Express
  - Zod (validação)

- **Outros**:
  - TMDB API para dados de filmes e séries
  - Vite como bundler

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js (versão 14+)
- Conta na [TMDB API](https://www.themoviedb.org/documentation/api) para obter uma chave de API

### Configuração

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/netflix-clone.git
   cd netflix-clone
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione sua chave da TMDB API:
     ```
     TMDB_API_KEY=sua_chave_api_aqui
     ```

4. Execute o projeto:
   ```bash
   npm run dev
   ```

5. Acesse no navegador:
   ```
   http://localhost:5000
   ```

## 📁 Estrutura do Projeto

```
netflix-clone/
├── client/               # Frontend React
│   ├── public/           # Arquivos estáticos
│   └── src/
│       ├── components/   # Componentes React
│       ├── context/      # Contextos (AuthContext, etc.)
│       ├── hooks/        # Hooks personalizados
│       ├── lib/          # Utilitários e configs
│       ├── pages/        # Páginas da aplicação
│       └── App.tsx       # Componente principal
├── server/               # Backend Express
│   ├── routes.ts         # Rotas da API
│   ├── storage.ts        # Gerenciamento de dados
│   └── tmdb.ts           # Integração com TMDB API
└── shared/               # Código compartilhado
    └── schema.ts         # Esquemas e tipos
```

## 🎯 Páginas Principais

- **Home**: Página inicial para usuários não autenticados
- **Login/Signup**: Autenticação de usuários
- **Seleção de Perfis**: Escolha entre perfis disponíveis
- **Browse**: Interface principal de navegação de conteúdo
- **Gerenciamento de Perfis**: Adição/edição de perfis e avatares

## 💭 Considerações sobre Design

Este projeto foi desenvolvido com o objetivo de replicar a experiência Netflix com grande fidelidade. Alguns pontos importantes:

- **Paleta de Cores**: Seguindo a identidade visual da Netflix
  - Primária: #E50914 (vermelho Netflix)
  - Fundo: #141414 (preto Netflix)
  - Texto: #FFFFFF (branco)
  - Fundo Secundário: #222222 (cinza escuro)
  - Hover: #181818 (cinza mais escuro)

- **Tipografia**: Uso da família de fontes Netflix Sans/Helvetica Neue
- **Responsividade**: Layout adaptado para diversos tamanhos de tela
- **Animações**: Transições suaves ao interagir com elementos

## 👤 Perfis Disponíveis no Demo

- **John**: Perfil principal com avatar de robô azul
- **Sarah**: Perfil secundário com avatar de emoji laranja
- **Michael**: Perfil com avatar de emoji verde
- **Kids**: Perfil infantil com logo colorido

## 🧪 Desenvolvimento Futuro

Recursos planejados para implementações futuras:

- Sistema de busca de conteúdo
- Implementação de Player de vídeo
- Funcionalidade de "Continuar Assistindo"
- Sistema de recomendações personalizado
- Suporte a múltiplos idiomas

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

---

Desenvolvido por João Vitor Belasque © 2025