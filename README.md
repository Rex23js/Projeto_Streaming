# Meu Streaming 🎬

![Status do Projeto](https://img.shields.io/badge/versão-v1.0--ui-success)

Bem-vindo ao "Meu Streaming", um projeto de plataforma de streaming de filmes e séries. Esta primeira versão foca na construção de uma interface de usuário (UI) moderna, responsiva e acessível, servindo como a base visual para futuras funcionalidades dinâmicas.

As próximas etapas incluirão o consumo de APIs públicas para exibir um catálogo dinâmico, visualizações de dados com Chart.js e implementação de testes.

# Link do Projeto Em Deploy
meu-streaming.netlify.app

## Índice

1.  [Visão Geral](#1-visão-geral)
2.  [Funcionalidades da Versão Atual (v1.0-ui)](#2-funcionalidades-da-versão-atual-v10-ui)
3.  [Wireframe e Protótipo de UI](#3-wireframe-e-protótipo-de-ui)
4.  [Tecnologias Utilizadas](#4-tecnologias-utilizadas)
5.  [APIs Selecionadas](#5-apis-selecionadas)
6.  [Estrutura do Projeto](#6-estrutura-do-projeto)
7.  [Versionamento com Git](#7-versionamento-com-git)
8.  [Acessibilidade e Responsividade](#8-acessibilidade-e-responsividade)
9.  [Testes Automatizados](#9-testes-automatizados)
10. [Como Executar o Projeto](#10-como-executar-o-projeto)

---

### 1. Visão Geral

O "Meu Streaming" é uma interface web front-end que simula uma plataforma de streaming. O projeto foi desenvolvido como um estudo prático de desenvolvimento web, aplicando conceitos de HTML semântico, CSS moderno com variáveis, um design system consistente e componentização com Bootstrap 5.

2. Funcionalidades da Versão Atual (v1.0-ui)
Página Inicial (Bem_Vindo.html): Apresenta uma introdução impactante do serviço com uma seção "hero", seguida por uma clara listagem dos planos disponíveis e um formulário de inscrição para novos usuários.

Catálogo (catalogo.html): Oferece uma galeria de filmes e séries com cards interativos. Inclui uma barra de busca funcional que interage com a API do TMDb para filtrar e exibir resultados dinamicamente.

Página de Pagamento (Pagamento.html): Interface intuitiva para a finalização da assinatura de um plano, com um formulário que se adapta ao plano selecionado pelo usuário na página inicial.

Página de Ajuda (ajuda.html): Central de suporte ao usuário, contendo uma seção de Perguntas Frequentes (FAQ) interativa, um formulário de contato e informações detalhadas sobre os recursos de acessibilidade.

Dashboard Analítico (dashboard.html): Uma página de análise de dados que exibe visualizações sobre o catálogo de filmes. Apresenta gráficos gerados dinamicamente com a biblioteca Chart.js, como "Distribuição de Gêneros" e "Popularidade Média vs. Contagem de Votos".

Acessibilidade Avançada (Acessibility.js):

Alternância de Tema: Permite que o usuário alterne entre um tema claro e um escuro (alto contraste) em todo o site.

Ajuste de Fonte: Funcionalidade para aumentar ou diminuir o tamanho da fonte para melhor legibilidade.

Persistência de Configurações: As escolhas de acessibilidade do usuário são salvas no localStorage do navegador e aplicadas consistentemente em todas as páginas.

Design Responsivo: A interface se adapta a diferentes tamanhos de tela, desde desktops a dispositivos móveis, garantindo uma experiência de usuário consistente e agradável em qualquer dispositivo.

Identidade Visual Coesa: Todas as páginas seguem uma estilização única e moderna, com foco em uma experiência de usuário imersiva e profissional.

O projeto contará com as seguintes funcionalidades e telas/seções:

- Visão geral da plataforma com destaques do catálogo.
- Apresentação dos **planos de assinatura** com botões de ação.
- Seção de Perguntas Frequentes (FAQ) e um formulário de Newsletter.
- Uma **visão geral da dashboard** (ex: um gráfico com Chart.js mostrando gêneros populares).

- **Página de Catálogo (`catalogo.html`):**

  - Exibirá o catálogo completo de filmes e séries.
  - Funcionalidade de **busca**, **filtro** e **ordenação** dos resultados.
  - Componente de Paginação para navegar por múltiplos resultados.

- **Página de Pagamento (`pagamento.html`):**

  - Uma nova página para simular o pagamento da assinatura.
  - Exibirá um **QR Code de pagamento fictício (Pix)** gerado dinamicamente com base no plano que o usuário selecionou na página inicial.

- **Página de Detalhes (`detalhes.html`):**

  - Mostra informações completas de um filme/série.

- **Página de Ajuda/Acessibilidade (`ajuda.html`):**
  - Fornece informações sobre os recursos de acessibilidade do site.
  - Oferece uma opção para alternar para um tema de alto contraste.

### 3. Wireframe e Protótipo de UI

Foram criados wireframes de baixa fidelidade para planejar a estrutura visual e a disposição dos elementos nas telas principais do projeto.

#### Página Inicial (Home)

![Wireframe da Página Inicial](wireframes/Wireframe_Bem_Vindo.png)

#### Página de Catálogo

![Wireframe da Página de Catálogo](wireframes/Wireframe_Catalogo.png)

#### Página de Detalhes

![Wireframe da Página de Detalhes](wireframes/Wireframe_Detalhes_Trailers.png)

O design da UI seguirá um tema escuro, com foco na usabilidade e legibilidade, utilizando componentes do Bootstrap 5 para uma prototipação ágil.

### 4. Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.
- **Bibliotecas:** Chart.js (para visualização de dados).
- **Testes:** Selenium (para testes de interface do usuário).
- **Ferramentas:** Git, GitHub, VS Code.

### 5. APIs Selecionadas

1. **The Movie Database (TMDb) API:**

   - Fonte principal de dados sobre filmes e séries.

2. **QR Code Generator API (`goqr.me`):**

   - Gera QR Codes de pagamento fictício (Pix).

3. **Chart.js (Biblioteca):**
   - Para criar gráficos interativos.

### 6. Estrutura do Projeto

/meu-streaming
|-- style.css
|-- script.js
|-- tests/
|-- Bem_Vindo.html
|-- catalogo.html
|-- dashboard.html
|-- deashboard.js
|-- Pagamento.html
|-- ajuda.html
|-- wireframes/
| |-- Wireframe_Bem_Vindo.png
| |-- Wireframe_Catalogo.png
| |-- Wireframe_Detalhes_Trailers.png
|-- README.md

### 7. Versionamento com Git

O projeto utiliza um fluxo de trabalho baseado no Git Flow, com as seguintes branches:

- **master:** Contém o código de produção, estável e pronto para deploy. Cada versão final será marcada com uma `tag`.
- **develop:** Branch principal de desenvolvimento. Novas funcionalidades são integradas aqui antes de irem para a `master`.
- **feature/\*:** Branches temporárias para o desenvolvimento de novas funcionalidades (ex: `feature/formulario-contato`).

### 8. Acessibilidade e Responsividade

- **Responsividade:** Layout totalmente adaptável a desktops, tablets e smartphones.
- **Acessibilidade (WCAG):** Contraste de cores adequado, textos alternativos para imagens, navegação via teclado e uso de atributos WAI-ARIA.
- Haverá uma **opção de acessibilidade** na página de ajuda para ativar um modo de alto contraste.

### 9. Testes Automatizados

#### **Tabela de Casos de Teste**

| ID do Teste | Funcionalidade Testada       | Cenário de Teste                        | Passos de Execução                                                             | Resultado Esperado                                                                       |
| ----------- | ---------------------------- | --------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| **TC-001**  | **Navegação Principal**      | Navegação da Home para o Catálogo       | 1. Abrir `Bem_Vindo.html`.<br>2. Clicar em "Assistir" ou "Login".              | Usuário é redirecionado para `catalogo.html`. `<h1>Explore nosso Catálogo</h1>` visível. |
| **TC-002**  | **Seleção de Plano**         | Redirecionamento para pagamento Premium | 1. Abrir a página inicial.<br>2. Clicar em "Assinar Agora" no card Premium.    | Usuário vai para `/pagamento.html?plano=premium`.                                        |
| **TC-003**  | **Geração de QR Code**       | Verificação do QR Code                  | 1. Acessar `/pagamento.html?plano=padrao`.                                     | O container `#qrcode-container` exibe `<img>` com `src` válido da API de QR Code.        |
| **TC-004**  | **Formulário de Newsletter** | Submissão de e-mail válido              | 1. Inserir `teste@teste.com` no campo newsletter.<br>2. Clicar em "Inscrever". | Mensagem de sucesso exibida e campo limpo.                                               |
| **TC-005**  | **Interatividade do FAQ**    | Abrir e fechar pergunta                 | 1. Clicar em uma pergunta no FAQ.<br>2. Clicar novamente.                      | Primeira vez: resposta aparece.<br>Segunda vez: resposta some.                           |
| **TC-006**  | **Acessibilidade**           | Alternância de Alto Contraste           | 1. Ir em `ajuda.html`.<br>2. Clicar no switch "Ativar Modo de Alto Contraste". | `<body>` recebe classe `high-contrast`, cores mudam.                                     |
| **TC-007**  | **Busca no Catálogo**        | Busca por filme                         | 1. Digitar "Inception" no campo de busca.<br>2. Clicar em "Buscar".            | Grade de filmes atualizada apenas com "Inception".                                       |
| **TC-008**  | **Validação de Formulário**  | Submissão de e-mail inválido            | 1. Inserir "email-invalido".<br>2. Clicar em "Inscrever".                      | Mensagem de erro exibida. Formulário não enviado.                                        |
| **TC-009**  | **Responsividade**           | Layout em mobile                        | 1. Redimensionar navegador para 375px de largura.                              | Cards reorganizados em 1 coluna, navbar vira menu hambúrguer.                            |

### 10. Como Executar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/Rex23js/meu-streaming.git
   ```
