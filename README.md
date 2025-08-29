# Meu Streaming 🎬

![Status do Projeto](https://img.shields.io/badge/versão-v1.0--ui-success)

Bem-vindo ao "Meu Streaming", um projeto de plataforma de streaming de filmes e séries. Esta primeira versão foca na construção de uma interface de usuário (UI) moderna, responsiva e acessível, servindo como a base visual para futuras funcionalidades dinâmicas.

As próximas etapas incluirão o consumo de APIs públicas para exibir um catálogo dinâmico, visualizações de dados com Chart.js e implementação de testes.

## Índice

1.  [Visão Geral](#1-visão-geral)
2.  [Funcionalidades da Versão Atual (v1.0-ui)](#2-funcionalidades-da-versão-atual-v10-ui)
3.  [Tecnologias Utilizadas](#3-tecnologias-utilizadas)
4.  [Estrutura do Projeto](#4-estrutura-do-projeto)
5.  [Como Executar o Projeto](#5-como-executar-o-projeto)
6.  [Próximos Passos](#6-próximos-passos)
7.  [Versionamento com Git](#7-versionamento-com-git)
8.  [Acessibilidade](#8-acessibilidade)

---

### 1. Visão Geral

O "Meu Streaming" é uma interface web front-end que simula uma plataforma de streaming. O projeto foi desenvolvido como um estudo prático de desenvolvimento web, aplicando conceitos de HTML semântico, CSS moderno com variáveis, um design system consistente e componentização com Bootstrap 5.

### 2. Funcionalidades da Versão Atual (v1.0-ui)

- **Página Inicial (`Bem_Vindo.html`):** Apresentação do serviço com seção "hero", listagem de planos e chamada para ação.
- **Catálogo (`catalogo.html`):** Grade de filmes com cards interativos e uma seção de busca e filtros.
- **Detalhes do Filme (`detalhes.html`):** Página modelo para exibir informações detalhadas de um título, como sinopse, elenco e trailer (simulado).
- **Página de Pagamento (`Pagamento.html`):** Interface para a finalização da assinatura de um plano.
- **Página de Ajuda (`ajuda.html`):** Seção com FAQ, formulário de contato e informações de acessibilidade.
- **Design Responsivo:** A interface se adapta a diferentes tamanhos de tela, de desktops a dispositivos móveis.
- **Tema Escuro e Estilização Coesa:** Todas as páginas seguem uma identidade visual única, com foco em uma experiência de usuário imersiva.

### 3. Tecnologias Utilizadas

- **HTML5:** Estruturação semântica do conteúdo.
- **CSS3:** Estilização avançada, com uso de Flexbox, Grid, Variáveis CSS e animações.
- **Bootstrap 5:** Framework para a construção de layout responsivo e componentização rápida.
- **Font Awesome:** Biblioteca de ícones.
- **Git & GitHub:** Para versionamento de código e gerenciamento do projeto.



#### **Tabela de Casos de Teste**

| ID do Teste | Funcionalidade Testada       | Cenário de Teste                                 | Passos de Execução                                                                                                                     | Resultado Esperado                                                                                                                                              |
| :---------- | :--------------------------- | :----------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TC-001**  | **Navegação Principal**      | Navegação da Home para o Catálogo                | 1. Abrir a página inicial (`Bem_Vindo.html`).<br>2. Clicar no botão/link "Assistir" ou "Login".                                        | O usuário é redirecionado para a página `catalogo.html`. O título `<h1>Explore nosso Catálogo</h1>` está visível.                                               |
| **TC-002**  | **Seleção de Plano**         | Redirecionamento para pagamento do Plano Premium | 1. Abrir a página inicial.<br>2. Localizar a seção de planos.<br>3. Clicar no botão "Assinar Agora" do card "Premium".                 | O usuário é redirecionado para a URL `/pagamento.html?plano=premium`. A página de pagamento é carregada.                                                        |
| **TC-003**  | **Geração de QR Code**       | Verificação da criação do QR Code de pagamento   | 1. Acessar a URL `/pagamento.html?plano=padrao`.                                                                                       | O contêiner do QR Code (`#qrcode-container`) deve conter uma tag `<img>` com um `src` válido da API de QR Code. O título da página deve indicar "Plano Padrão". |
| **TC-004**  | **Formulário de Newsletter** | Submissão de e-mail válido                       | 1. Abrir a página inicial.<br>2. Inserir um e-mail válido (ex: `teste@teste.com`) no campo da newsletter.<br>3. Clicar em "Inscrever". | Uma mensagem de sucesso (ex: "Obrigado por se inscrever!") é exibida. O campo de e-mail é limpo.                                                                |
| **TC-005**  | **Interatividade do FAQ**    | Funcionalidade do Accordion                      | 1. Abrir a página inicial.<br>2. Clicar no título de uma pergunta na seção FAQ.<br>3. Clicar novamente no mesmo título.                | Ao primeiro clique, o corpo da resposta correspondente se torna visível.<br>Ao segundo clique, o corpo da resposta é ocultado.                                  |
| **TC-006**  | **Acessibilidade**           | Alternância de Tema de Alto Contraste            | 1. Abrir a página `ajuda.html`.<br>2. Clicar no switch "Ativar Modo de Alto Contraste".                                                | O `<body>` da página deve receber uma classe (ex: `high-contrast`), e as cores de fundo e texto devem mudar para um esquema de maior contraste.                 |
| **TC-007**  | **Busca no Catálogo**        | Simulação de busca por um filme                  | 1. Abrir a página `catalogo.html`.<br>2. Digitar "Inception" no campo de busca.<br>3. Clicar no botão "Buscar".                        | (Requisito para Etapa 3) A grade de filmes é atualizada, e os cards exibidos devem corresponder aos resultados da busca.                                        |
| **TC-008**  | **Validação de Formulário**  | Submissão de e-mail inválido na Newsletter       | 1. Abrir a página inicial.<br>2. Inserir um texto inválido (ex: "email-invalido") no campo da newsletter.<br>3. Clicar em "Inscrever". | Uma mensagem de erro indicando "Por favor, insira um e-mail válido" é exibida abaixo do campo. O formulário não é enviado.                                      |
| **TC-009**  | **Responsividade**           | Verificação do Layout em Dispositivo Móvel       | 1. Abrir a página inicial.<br>2. Redimensionar a janela do navegador para uma largura de 375px.                                        | Os cards de planos e de filmes devem se reorganizar em uma única coluna. A barra de navegação deve ser substituída por um menu "hambúrguer".                    |

### 10. Como Executar o Projeto

1.  Clone o repositório: `git clone https://github.com/seu-usuario/meu-streaming.git`
2.  Navegue até a pasta do projeto: `cd meu-streaming`
3.  Abra o arquivo `Bem_Vindo.html` em seu navegador.
