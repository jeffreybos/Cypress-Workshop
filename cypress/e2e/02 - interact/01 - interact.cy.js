// IMPORTANT ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
// remember to manually delete all items before running the test
// IMPORTANT ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

describe('02 - Adding', () => {
  it('should add two todos', () => {
    // visit the site
    // https://on.cypress.io/visit
    // repeat twice
    //    get the input field
    //    https://on.cypress.io/get
    //    type text and "enter"
    //    https://on.cypress.io/type
    //    assert that the new Todo item
    //    has been added added to the list
    // cy.get(...).should('have.length', 2)
  })

  it('should mark an item as completed', () => {
    // visit the site
    // adds more items
    // marks the first item as completed
    // https://on.cypress.io/get
    // https://on.cypress.io/find
    // https://on.cypress.io/first
    // https://on.cypress.io/click
    // confirms the first item has the expected completed class
    // confirms the other items are still incomplete
    // check the number of remaining items
  })

  it('should mark all (or) multiple items as completed and clear all', () => {
    // visit the site
    // adds more items
    // marks all items as completed
    // click the clear completed button
    // confirm all items are gone
  })

  it('should delete an item', () => {
    // visit the site
    // adds more items
    // deletes the first item
    // use force: true because we don't want to hover
    // confirm the deleted item is gone from the dom
    // confirm the other item still exists
  })

  it('should delete all items', () => {
    // visit the site
    // adds more items
    // for each todo item click the remove button
    // tip: use cy.each and cy.wrap commands
    // confirm that the item is gone from the dom
    // using "should not exist" or "should have length 0" assertion
  })
})
