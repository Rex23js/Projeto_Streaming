# Meu Streaming - Protótipo de Plataforma de Filmes e Séries

Este é um protótipo de uma plataforma de streaming de filmes e séries, desenvolvido em 4 dias como um projeto de aprendizado. O objetivo é criar uma interface moderna, responsiva e interativa, com funcionalidades essenciais inspiradas em serviços como Netflix e Disney+.

---

### Funcionalidades Planejadas

O escopo do projeto inclui as seguintes funcionalidades:

- [x] **Estrutura Base da Home:** Layout inicial com Navbar, Banner e grid de cards.
- [x] [cite_start]**Estilização e Efeitos:** Efeitos de hover nos cards com transições suaves para uma experiência mais dinâmica[cite: 4].
- [x] **Navegação Básica:** Links dos cards para uma página de detalhes.
- [ ] **Múltiplas Categorias:** Seções separadas na home (ex: "Populares", "Lançamentos").
- [ ] [cite_start]**Banner de Destaque Detalhado:** Banner principal com informações de um filme ou série em destaque[cite: 1].
- [ ] [cite_start]**Busca Dinâmica:** Campo de busca funcional que filtra o conteúdo com dados de uma API[cite: 3, 1].
- [ ] [cite_start]**Página de Detalhes Completa:** Página com imagem, sinopse completa e trailer de um filme/série[cite: 2].
- [ ] [cite_start]**Responsividade Completa:** Layout totalmente adaptável para desktops e dispositivos móveis (Bootstrap 5)[cite: 3].

---

### Tecnologias Utilizadas

- **HTML5:** Estruturação do conteúdo.
- **CSS3:** Estilização personalizada e animações.
- **Bootstrap 5:** Framework para criação de layout responsivo e componentes de UI.
- **JavaScript (Fetch API):** Para consumir dados da API de filmes (TMDB) e manipular o DOM.

---

### Cenários de Teste (Selenium IDE)

Este projeto foi construído com a testabilidade em mente. Os seguintes cenários serão automatizados:

1.  **Carregamento da Página Inicial:**

    - Verificar se a página `index.html` carrega corretamente.
    - Confirmar a presença da Navbar, do Banner e do grid de filmes.

2.  **Funcionalidade da Busca:**

    - Digitar um termo no campo de busca.
    - Clicar no botão "Buscar".
    - Verificar se os resultados exibidos correspondem ao termo pesquisado.

3.  **Navegação para Detalhes:**

    - Clicar em um card de filme qualquer.
    - Verificar se a aplicação navega para a página `detalhes.html`.
    - Confirmar se o título na nova página corresponde ao esperado.

4.  **Verificação de Responsividade:**
    - Redimensionar a janela do navegador para uma largura de dispositivo móvel.
    - Verificar se o grid de cards se ajusta corretamente (ex: de 4 colunas para 1 ou 2 colunas).
