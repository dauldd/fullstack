describe('Blogs ordered by likes', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'daul2',
      username: 'daul2',
      password: 'daul2'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:5173')

    cy.get('#username').type('daul2')
    cy.get('#password').type('daul2')
    cy.get('#login_button').click()
  })

  it('orders blogs correctly by likes', function() {
    cy.contains('new blog').click()
    cy.get('#title').type('Blog A')
    cy.get('#author').type('Author A')
    cy.get('#url').type('url-a.com')
    cy.get('#create_button').click()

    cy.contains('Blog A Author A')
      .parent()
      .find('button')
      .contains('view')
      .click()

    cy.contains('Blog A Author A')
      .closest('.blog')
      .find('[data-cy="like-button"]')
      .click()

    cy.contains('create new blog').click()
    cy.get('#title').type('Blog B')
    cy.get('#author').type('Author B')
    cy.get('#url').type('url-b.com')
    cy.get('#create_button').click()

    cy.contains('Blog B Author B')
      .parent()
      .find('button')
      .contains('view')
      .click()

    cy.contains('Blog B Author B')
      .closest('.blog')
      .find('[data-cy="like-button"]')
      .click()
    
    cy.reload()

    cy.contains('Blog B Author B')
      .parent()
      .find('button')
      .contains('view')
      .click()
      
    cy.contains('Blog B Author B')
      .closest('.blog')
      .find('[data-cy="like-button"]')
      .click()
      .click()

    cy.reload()

    cy.get('.blog').eq(0).should('contain', 'Blog B')
    cy.get('.blog').eq(1).should('contain', 'Blog A')
  })
})
