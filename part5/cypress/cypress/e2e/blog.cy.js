describe('Blog app', function() {
  beforeEach(function() {
    cy.resetDatabase()
    cy.createUser({ name: 'daul2', username: 'daul2', password: 'daul2' })
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('login')
    cy.get('#username')
    cy.get('#password')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('daul2')
      cy.get('#password').type('daul2')
      cy.get('#login_button').click()
      cy.contains('daul2 logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('wrongpass')
      cy.get('#login_button').click()
      cy.get('.error').should('contain', 'Wrong credentials')
      cy.get('html').should('not.contain', 'daul2 logged-in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'daul2', password: 'daul2' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Cypress1')
      cy.get('#author').type('Cypress2')
      cy.get('#url').type('cypress.com')
      cy.get('#create_button').click()
      cy.contains('Cypress1 Cypress2')
    })

    it('A blog can be liked', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Blog To Like')
      cy.get('#author').type('Like Author')
      cy.get('#url').type('http://likeblog.com')
      cy.get('#create_button').click()

      cy.contains('Blog To Like Like Author')
        .parent()
        .find('button')
        .contains('view')
        .click()

      cy.contains('likes 0')
      cy.get('[data-cy="like-button"]').click()
      cy.contains('likes 1')
    })

    it('Only creator sees delete button', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Creator Blog')
      cy.get('#author').type('Creator Author')
      cy.get('#url').type('created')
      cy.get('#create_button').click()

      cy.reload()

      cy.contains('Creator Blog Creator Author')
        .parent()
        .find('button')
        .contains('view')
        .click()

      cy.get('#delete_button').should('exist')

      cy.contains('logout').click()

      const otherUser = {
        name: 'Other User',
        username: 'otheruser',
        password: 'otherpass'
      }
      cy.createUser(otherUser)

      cy.get('#username').type('otheruser')
      cy.get('#password').type('otherpass')
      cy.get('#login_button').click()

      cy.contains('Creator Blog Creator Author')
        .parent()
        .find('button')
        .contains('view')
        .click()

      cy.reload()

      cy.contains('Creator Blog Creator Author')
        .parent()
        .find('button')
        .contains('delete')
        .should('not.exist')
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
        .closest('.blog')
        .within(() => {
          cy.contains('view').click()
          cy.get('[data-cy="like-button"]').click().click()
        })

      cy.reload()

      cy.get('.blog').eq(0).should('contain', 'Blog B')
      cy.get('.blog').eq(1).should('contain', 'Blog A')
    })
  })
})


// sometimes cypress is too fast and might throw error because of it