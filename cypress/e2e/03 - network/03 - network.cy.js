describe('03 - Network', () => {
  // see https://on.cypress.io/intercept

  it('starts with zero items (waits)', () => {
    cy.visit('localhost:3000')
    // wait 1 second
    // then check the number of items
    cy.get('li.todo').should('have.length', 0)
  })

  it('starts with zero items (network wait)', () => {
    // spy on route `GET /todos`
    //  with cy.intercept(...).as(<alias name>)
    // THEN visit the page
    cy.visit('localhost:3000')
    // wait for `GET /todos` route
    //  using "@<alias name>" string
    // then check the DOM
    cy.get('li.todo').should('have.length', 0)
  })

  it('starts with zero items (delay)', () => {
    // spy on the network call GET /todos
    // visit the page with localhost:3000/?delay=2000 query parameter
    // this will delay the GET /todos call by 2 seconds
    cy.visit('localhost:3000/?delay=2000')
    // wait for todos call
    // confirm there are no items on the page
  })

  it('starts with zero items (delay plus render delay)', () => {
    // spy on the GET /todos call and give it an alias
    // visit the page with query parameters
    // to delay the GET call and delay rendering the received items
    // localhost:3000/?delay=2000&renderDelay=1500
    cy.visit('localhost:3000/?delay=2000&renderDelay=1500')
    // wait for the network call to happen
    // confirm there are no todos
  })

  it('starts with zero items (check body.loaded)', () => {
    // cy.visit('localhost:3000')
    // or use delays to simulate the delayed load and render
    cy.visit('localhost:3000/?delay=2000&renderDelay=1500')
    // the application sets "loaded" class on the body
    // in the test we can check for this class
    // THEN check the number of items
    cy.get('li.todo').should('have.length', 0)
  })

  it('starts with zero items (check the window)', () => {
    // use delays to simulate the delayed load and render
    cy.visit('localhost:3000/?delay=2000&renderDelay=1500')
    // the application code sets the "window.todos"
    // when it finishes loading the items
    // (see app.js)
    //  if (window.Cypress) {
    //    window.todos = todos
    //  }
    // thus we can check from the test if the "window"
    // object has property "todos"
    // https://on.cypress.io/window
    // https://on.cypress.io/its
    // then check the number of items rendered on the page
  })

  it('starts with zero items (stubbed response)', () => {
    // using cy.intercept() stub `GET /todos` with []
    // save the stub as an alias

    // THEN visit the page
    cy.visit('localhost:3000')

    // wait for the intercept alias
    // grab its response body
    // and make sure the body is an empty list
  })

  it('starts with zero items (fixture)', () => {
    // start Cypress network server
    // stub `GET /todos` with fixture "empty-list"

    // visit the page
    cy.visit('localhost:3000')

    // then check the DOM
    cy.get('li.todo').should('have.length', 0)
  })

  it('loads several items from a fixture', () => {
    // stub route `GET /todos` with data from a fixture file "two-items.json"
    // THEN visit the page
    cy.visit('localhost:3000')
    // then check the DOM: some items should be marked completed
    // we can do this in a variety of ways
  })

  it('confirms the request and the response', () => {
    // spy on "POST /todos", save as alias
    cy.visit('localhost:3000')
    cy.get('.new-todo').type('test api{enter}')
    // wait for the intercept and verify its request body
    // get the same intercept again and verify its response body
  })

  it('handles 404 when loading todos', () => {
    // when the app tries to load items
    // set it up to fail with 404 to GET /todos
    // Tip: cy.intercept response body with statusCode: 404
    // after delay of 2 seconds
    cy.visit('localhost:3000', {
      // spy on console.error because we expect app would
      // print the error message there
      onBeforeLoad: (win) => {
        // spy on console.error
      }
    })
    // observe external effect from the app - console.error(...)
    // cy.get('@console-error')
    //   .should(...)
  })

  // a test that confirms a specific network call is NOT made
  // until the application adds a new item.
  it('does not make POST /todos request on load', () => {
    // a cy.spy() creates a "pass-through" function
    // that can function as a network interceptor that does nothing
    cy.intercept('POST', '/todos', cy.spy().as('post'))
    // in order to confirm the network call was not made
    // we need to wait for something to happen, like the application
    // loading or some time passing
    // add a new item through the page UI
    // now the network call should have been made
    // confirm the network call was made with the correct data
  })
})
