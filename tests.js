describe('Testes da Página Meu Streaming', () => {
  // Altere a URL para o local correto do seu projeto
  const baseUrl = 'http://localhost:5500/Bem_Vindo.html';

  beforeEach(() => {
    cy.visit(('/Projeto_Streaming/Bem_Vindo.html'));
  });

  // ✅ Teste 1: Verifica se a página carrega corretamente
  it('Deve carregar a página corretamente', () => {
    cy.contains('Bem-vindo ao Meu Streaming').should('be.visible');
    cy.title().should('include', 'Meu Streaming');
  });

  // ✅ Teste 2: Navegação pelo menu principal
  it('Deve navegar para o catálogo', () => {
    cy.get('a.nav-link').contains('Catálogo').click();
    cy.url().should('include', 'catalogo.html');
  });

  it('Deve navegar para a página de ajuda', () => {
    cy.get('a.nav-link').contains('Ajuda').click();
    cy.url().should('include', 'ajuda.html');
  });

  // ✅ Teste 3: Cards de filmes e séries
  it('Deve exibir 4 filmes populares', () => {
    cy.contains('Filmes Populares').should('exist');
    cy.get('.container').eq(1).find('.card').should('have.length', 4);
  });

  it('Deve exibir 4 séries em alta', () => {
    cy.contains('Séries em Alta').should('exist');
    cy.get('.container').eq(2).find('.card').should('have.length', 4);
  });

  // ✅ Teste 4: Planos e preços
  it('Deve exibir 3 planos de assinatura', () => {
    cy.get('.card-plan').should('have.length', 3);
  });

  it('Botão do Plano Básico deve redirecionar corretamente', () => {
    cy.get('a[href="Pagamento.html?plano=basico"]').click();
    cy.url().should('include', 'Pagamento.html?plano=basico');
  });

  it('Botão do Plano Padrão deve redirecionar corretamente', () => {
    cy.get('a[href="Pagamento.html?plano=padrao"]').click();
    cy.url().should('include', 'Pagamento.html?plano=padrao');
  });

  it('Botão do Plano Premium deve redirecionar corretamente', () => {
    cy.get('a[href="Pagamento.html?plano=premium"]').click();
    cy.url().should('include', 'Pagamento.html?plano=premium');
  });

  // ✅ Teste 5: Rodapé (footer)
  it('Deve conter links de navegação e suporte no rodapé', () => {
    cy.get('footer').within(() => {
      cy.contains('Início');
      cy.contains('Catálogo');
      cy.contains('Ajuda');
      cy.contains('FAQ');
      cy.contains('Contato');
    });
  });

  it('Deve conter descrição sobre o projeto no rodapé', () => {
    cy.get('footer').should('contain.text', 'Desenvolvido com HTML');
  });
});

