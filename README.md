# Meu Streaming 🎬

![Status do Projeto](https://img.shields.io/badge/status-planejamento-blue)

Bem-vindo ao "Meu Streaming", um projeto de plataforma de streaming de filmes e séries. A aplicação consome múltiplas APIs públicas para exibir um catálogo de mídia dinâmico, visualizações de dados com Chart.js e foca em boas práticas de desenvolvimento, acessibilidade e testes.

## Índice

1.  [Visão Geral e Justificativa](#1-visão-geral-e-justificativa)
2.  [Escopo e Funcionalidades](#2-escopo-e-funcionalidades)
3.  [Wireframe e Protótipo de UI](#3-wireframe-e-protótipo-de-ui)
4.  [Tecnologias Utilizadas](#4-tecnologias-utilizadas)
5.  [APIs Selecionadas](#5-apis-selecionadas)
6.  [Estrutura do Projeto](#6-estrutura-do-projeto)
7.  [Versionamento com Git](#7-versionamento-com-git)
8.  [Acessibilidade e Responsividade](#8-acessibilidade-e-responsividade)
9.  [Testes Automatizados](#9-testes-automatizados)

---

### 1. Visão Geral e Justificativa

**Visão Geral:** O "Meu Streaming" é uma interface web que permite aos usuários navegar por catálogos de filmes, buscar títulos, ver notícias sobre o mundo do entretenimento e entrar em contato através de um formulário. O projeto integra dados de fontes externas e apresenta análises visuais através de gráficos.

**Justificativa:** Este projeto foi escolhido pela oportunidade de trabalhar com desafios técnicos completos, como o consumo de múltiplas APIs, a criação de uma interface de usuário rica e acessível, a implementação de testes automatizados e a prática de um fluxo de trabalho de versionamento profissional com Git.

### 2. Escopo e Funcionalidades

O projeto contará com as seguintes funcionalidades e telas/seções:

- **Página Inicial (`index.html`):**

  - Visão geral da plataforma com destaques do catálogo.
  - Uma **visão geral da dashboard** (ex: um gráfico pequeno com Chart.js mostrando gêneros populares).
  - Uma seção com as **últimas notícias** sobre filmes (usando a segunda API).
  - Um **formulário de contato** funcional.

- **Página de Detalhes (`detalhes.html`):**

  - Mostra informações completas de um filme/série, como sinopse, elenco, avaliação e trailer.

- **Página de Ajuda/Acessibilidade (`ajuda.html`):**
  - Fornece informações sobre o projeto.
  - Detalha os recursos de acessibilidade implementados e oferece **opções de acessibilidade** (ex: botão para modo de alto contraste).

### 3. Wireframe e Protótipo de UI

Um wireframe de baixa fidelidade foi criado para planejar a estrutura visual e a disposição dos elementos nas telas principais do projeto.

- **[Acesse o Wireframe aqui](wireframe.png)**

O design da UI seguirá um tema escuro, com foco na usabilidade e legibilidade, utilizando componentes do Bootstrap 5 para uma prototipação ágil.

### 4. Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.
- **Bibliotecas:** Chart.js (para visualização de dados).
- **Testes:** Selenium (para testes de interface do usuário).
- **Ferramentas:** Git, GitHub, VS Code.

### 5. APIs Selecionadas

1.  **The Movie Database (TMDb) API:**

    - **Propósito:** Fonte principal de dados sobre filmes e séries (pôsteres, sinopses, avaliações, etc.).
    - **Status:** Chave de API a ser obtida.

2.  **GNews API:**

    - **Propósito:** Fornecer notícias em tempo real sobre o mundo do cinema para uma seção na página inicial. Isso cumpre o requisito de uma segunda API de dados.
    - **Status:** Chave de API a ser obtida.

3.  **Chart.js (Biblioteca):**
    - **Propósito:** Será utilizada para criar gráficos interativos, como a "visão geral da dashboard" na página inicial, processando dados obtidos da TMDb.

### 6. Estrutura do Projeto

/meu-streaming
|
|-- /css
|-- /js
|-- /tests
|-- /images
|
|-- index.html
|-- detalhes.html
|-- ajuda.html
|
|-- wireframe.png <-- Imagem do Wireframe
|-- README.md

### 7. Versionamento com Git

O projeto utiliza um fluxo de trabalho baseado no Git Flow, com as seguintes branches:

- **`main`:** Contém o código de produção, estável e pronto para deploy. Cada versão final (entrega) será marcada com uma `tag`.
- **`develop`:** Branch principal de desenvolvimento. Novas funcionalidades são integradas aqui antes de serem enviadas para a `main`.
- **`feature/*`:** Branches temporárias para o desenvolvimento de novas funcionalidades (ex: `feature/formulario-contato`). Após a conclusão, são mescladas na `develop`.

### 8. Acessibilidade e Responsividade

- **Responsividade:** O layout será totalmente adaptável a desktops, tablets e smartphones.
- **Acessibilidade (WCAG):** Serão implementadas práticas como contraste de cores adequado, textos alternativos para imagens, navegação completa via teclado e uso de atributos WAI-ARIA. Haverá uma **opção de acessibilidade** na página de ajuda para ativar um modo de alto contraste.

### 9. Testes Automatizados

Serão criados testes de interface com Selenium para validar as funcionalidades críticas. Os casos de teste serão documentados e incluirão cenários como:

- Submissão do formulário de contato.
- Funcionalidade da barra de busca.
- Navegação entre a página inicial e a de detalhes.

### 10. Como Executar o Projeto

1.  Clone o repositório: `git clone https://github.com/seu-usuario/meu-streaming.git`
2.  Navegue até a pasta do projeto: `cd meu-streaming`
3.  Abra o arquivo `index.html` em seu navegador.

\*Observação: Para as funcionalidades de API funcionarem, será necessário ob
