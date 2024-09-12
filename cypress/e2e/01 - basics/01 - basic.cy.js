describe('01 - Basics', () => {
  it('should load the todo app', () => {
    cy.visit('localhost:3000')

    // passing assertions
    // https://on.cypress.io/get
    cy.get('.new-todo').get('footer')

    // this assertion fails on purpose
    // can you fix it?
    // https://on.cypress.io/contains
    cy.contains('h1', 'Todos App')
  })
})
