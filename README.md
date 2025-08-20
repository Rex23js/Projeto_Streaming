# Meu Streaming 🎬

![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

Bem-vindo ao "Meu Streaming", um projeto de plataforma de streaming de filmes e séries desenvolvido como parte de um estudo prático de tecnologias web. A aplicação consome APIs públicas para exibir um catálogo de mídia dinâmico e interativo.

## Índice

1.  [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2.  [Justificativa](#2-justificativa)
3.  [Escopo e Funcionalidades](#3-escopo-e-funcionalidades)
4.  [Protótipo de UI (User Interface)](#4-protótipo-de-ui-user-interface)
5.  [Tecnologias Utilizadas](#5-tecnologias-utilizadas)
6.  [APIs Selecionadas](#6-apis-selecionadas)
7.  [Estrutura do Projeto](#7-estrutura-do-projeto)
8.  [Acessibilidade e Responsividade](#8-acessibilidade-e-responsividade)
9.  [Testes Automatizados](#9-testes-automatizados)
10. [Como Executar o Projeto](#10-como-executar-o-projeto)

---

### 1. Visão Geral do Projeto

O "Meu Streaming" é uma interface web responsiva que permite aos usuários navegar por catálogos de filmes e séries, buscar por títulos específicos e visualizar informações detalhadas sobre cada obra. O projeto foi concebido para aplicar conhecimentos em HTML, CSS, JavaScript e Bootstrap, com foco na integração de APIs, boas práticas de desenvolvimento, acessibilidade e testes automatizados.

### 2. Justificativa

Este projeto foi escolhido por sua relevância no mercado atual e pela oportunidade de trabalhar com uma variedade de desafios técnicos importantes, como:

- **Consumo de APIs externas:** Praticar requisições assíncronas (fetch/AJAX) para obter e exibir dados dinâmicos.
- **Manipulação de Dados:** Tratar e apresentar dados complexos (listas de filmes, detalhes, gêneros).
- **Interface de Usuário Moderna:** Criar um layout atrativo e funcional, utilizando um framework de UI como o Bootstrap.
- **Qualidade de Software:** Implementar testes automatizados para garantir a estabilidade das funcionalidades críticas.
- **Inclusão Digital:** Aplicar conceitos de acessibilidade para garantir que a plataforma possa ser utilizada por todos.

### 3. Escopo e Funcionalidades

O projeto contará com as seguintes funcionalidades e telas:

- **Página Inicial (`index.html`):**

  - Apresenta uma visão geral da plataforma.
  - Exibe seções de "Filmes Populares" e "Séries em Alta", com cards interativos.
  - Barra de navegação e rodapé informativos.

- **Página de Catálogo (`catalogo.html`):**

  - Exibirá o catálogo completo de filmes e séries, com opções de filtro (por gênero, ano, etc.).
  - Funcionalidade de busca para encontrar títulos específicos.

- **Página de Detalhes (`detalhes.html`):**

  - Mostra informações completas de um filme ou série selecionado, como sinopse, elenco, avaliação, trailer (se disponível) e recomendações.

- **Página de Análise/Dashboard (`dashboard.html`):**

  - Utilizará a biblioteca **Chart.js** para exibir gráficos interativos, como "Popularidade de Gêneros" ou "Filmes com Maiores Avaliações".

- **Página de Ajuda/Acessibilidade (`ajuda.html`):**
  - Fornecerá informações sobre o projeto e, principalmente, sobre os recursos de acessibilidade implementados, como navegação por teclado e compatibilidade com leitores de tela.

### 4. Protótipo de UI (User Interface)

O design da interface será inspirado nas principais plataformas de streaming, com um tema escuro para proporcionar conforto visual.

- **Paleta de Cores:** Fundo escuro (`#141414`), cards em um tom de cinza (`#222`), e textos em branco ou cinza claro, com uma cor de destaque (ex: vermelho ou azul) para links e botões.
- **Layout:** Baseado em grid (Bootstrap), com cards de conteúdo que se ajustam a diferentes tamanhos de tela.
- **Interatividade:** Efeitos de `hover` nos cards para dar feedback visual ao usuário (zoom suave e sombra, como já implementado no `style.css`).

### 5. Tecnologias Utilizadas

- **Frontend:**

  - **HTML5:** Estruturação semântica do conteúdo.
  - **CSS3:** Estilização customizada e animações.
  - **JavaScript (ES6+):** Manipulação do DOM, lógica da aplicação e requisições à API.
  - **Bootstrap 5:** Framework de UI para prototipação rápida, responsividade e componentes pré-estilizados.

- **Ferramentas e Boas Práticas:**
  - **Git & GitHub:** Versionamento de código, com uso de branches para desenvolvimento de funcionalidades e Pull Requests para revisão.
  - **Selenium:** Automação de testes de interface do usuário (UI testing).
  - **WAI-ARIA:** Padrões para acessibilidade em aplicações web.

### 6. APIs Selecionadas

1.  **The Movie Database (TMDb) API:**

    - **Propósito:** Será a fonte principal de dados sobre filmes e séries.
    - **Endpoints Utilizados:**
      - `/movie/popular`: Para buscar os filmes mais populares.
      - `/tv/popular`: Para buscar as séries mais populares.
      - `/search/movie`: Para a funcionalidade de busca.
      - `/movie/{id}`: Para obter os detalhes de um filme específico.

2.  **Chart.js (Biblioteca):**
    - **Propósito:** Embora seja uma biblioteca e não uma API de dados, será utilizada para criar visualizações de dados na página de Dashboard. Os dados para os gráficos serão processados a partir das informações obtidas da TMDb API.

### 7. Estrutura do Projeto

/meu-streaming
|
|-- /css
| |-- style.css # Estilos personalizados
|
|-- /js
| |-- api.js # Lógica para chamadas à API TMDb
| |-- main.js # Script principal (manipulação do DOM)
| |-- charts.js # Script para a página de dashboard com Chart.js
|
|-- /tests
| |-- test_search.py # Exemplo de teste com Selenium para a busca
| |-- test_navigation.py # Exemplo de teste de navegação entre páginas
|
|-- index.html # Página inicial
|-- catalogo.html # Página com o catálogo completo
|-- detalhes.html # Página de detalhes do filme/série
|-- dashboard.html # Página com os gráficos
|-- ajuda.html # Página de ajuda e acessibilidade
|
|-- README.md # Documentação do projeto

### 8. Acessibilidade e Responsividade

- **Responsividade:** O layout será construído com o sistema de grid do Bootstrap e Flexbox, garantindo uma experiência de uso consistente em desktops, tablets e smartphones.
- **Acessibilidade (WCAG):**
  - **Contraste de Cores:** A paleta de cores será escolhida para garantir um contraste adequado entre texto e fundo.
  - **Textos Alternativos:** Todas as imagens (como pôsteres de filmes) terão o atributo `alt` preenchido.
  - **Navegação por Teclado:** Todos os elementos interativos (links, botões) serão acessíveis através da tecla `Tab`.
  - **ARIA Roles:** Serão utilizados atributos WAI-ARIA para melhorar a semântica de componentes complexos para leitores de tela.

### 9. Testes Automatizados

Os testes serão focados na interface do usuário para garantir que as funcionalidades críticas funcionem como esperado. Utilizaremos **Selenium** para simular a interação do usuário.

- **Casos de Teste Planejados:**
  1.  **Teste de Busca:**
      - **Cenário:** O usuário digita o nome de um filme na barra de busca e clica em "Buscar".
      - **Resultado Esperado:** A página de catálogo é carregada com os resultados correspondentes.
  2.  **Teste de Navegação para Detalhes:**
      - **Cenário:** O usuário clica em um card de filme na página inicial.
      - **Resultado Esperado:** A página de detalhes do filme correspondente é carregada.
  3.  **Teste de Responsividade do Layout:**
      - **Cenário:** A janela do navegador é redimensionada para uma largura de dispositivo móvel.
      - **Resultado Esperado:** O layout de grid se ajusta, exibindo menos colunas de filmes sem quebrar a interface.

---

### 10. Como Executar o Projeto

1.  Clone o repositório: `git clone https://github.com/seu-usuario/meu-streaming.git`
2.  Navegue até a pasta do projeto: `cd meu-streaming`
3.  Abra o arquivo `index.html` em seu navegador.

_Observação: Para as funcionalidades de API funcionarem, será necessário obter uma chave de API gratuita no site da [TMDb](https://www.themoviedb.org/documentation/api) e configurá-la no arquivo `js/api.js`._
