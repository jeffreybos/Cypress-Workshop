const addItem = (text) => {
  cy.get('.new-todo').type(text)
  cy.get('.new-todo').type('{enter}')
}

describe('02 - Adding', () => {
  beforeEach(() => {
    cy.visit('localhost:3000')
  })

  it('should add two todos', () => {
    addItem('first todo')
    addItem('second todo')
    cy.get('.todo-list li').should('have.length', 2)
  })

  it('should mark an item as completed', () => {
    addItem('third todo')
    addItem('fourth todo')
    addItem('fifth todo')
    addItem('sixth todo')

    // marks the first item as completed
    cy.contains('li.todo', 'third todo').should('exist').find('.toggle').check()
    // confirms the first item has the expected completed class
    cy.contains('li.todo', 'third todo').should('have.class', 'completed')
    // confirms the other items are still incomplete
    cy.contains('li.todo', 'fourth todo').should('not.have.class', 'completed')
  })

  it('should mark all (or) multiple items as completed and then clear all', () => {
    cy.get('li.todo').each(($item) => {
      cy.wrap($item).find('.toggle').check()
    })

    cy.get('li.todo').each(($item) => {
      cy.wrap($item).should('have.class', 'completed')
    })

    cy.get('.clear-completed').click()
    cy.get('li.todo').should('have.length', 0)
  })

  it('should delete an item', () => {
    addItem('simple')
    addItem('hard')

    cy.contains('li.todo', 'simple')
      .should('exist')
      .find('.destroy')
      // use force: true because we don't have the hover
      .click({ force: true })

    // confirm the deleted item is gone from the dom
    cy.contains('li.todo', 'simple').should('not.exist')
    // confirm the other item still exists
    cy.contains('li.todo', 'hard').should('exist')
    // deletes the first item
    // use force: true because we don't want to hover
    // confirm the deleted item is gone from the dom
    // confirm the other item still exists
  })

  it('should delete all items', () => {
    addItem('simple')
    addItem('hard')
    addItem('simple 1')
    addItem('hard 2')
    // get all todo items (there might not be any!)
    cy.get('li.todo')
      // for each todo item click the remove button
      .each(($item) => {
        cy.wrap($item).find('.destroy').click({ force: true })
      })
    // confirm that the item is gone from the dom
    cy.get('li.todo').should('not.exist')
  })
})
