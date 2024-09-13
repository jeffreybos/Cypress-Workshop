describe('03 - Network', () => {
  // see https://on.cypress.io/intercept

  it('starts with zero items (waits)', () => {
    cy.visit('localhost:3000')
    cy.wait(1000)
    cy.get('li.todo').should('have.length', 0)
  })

  it('starts with zero items (network wait)', () => {
    cy.intercept('GET', '/todos').as('todos')
    // spy on route `GET /todos`
    // THEN visit the page
    cy.visit('localhost:3000')
    // wait for `GET /todos` response
    cy.wait('@todos')
      // inspect the server's response
      .its('response.body')
      .should('have.length', 0)
    // then check the DOM
    // note that we don't have to use "cy.wait(...).then(...)"
    // because all Cypress commands are flattened into a single chain
    // automatically. Thus just write "cy.wait(); cy.get();" naturally
    cy.get('li.todo').should('have.length', 0)
  })

  it('starts with zero items (delay)', () => {
    // spy on the network call GET /todos
    cy.intercept('GET', '/todos').as('todos')
    // visit the page with /?delay=2000 query parameter
    // this will delay the GET /todos call by 2 seconds
    cy.visit('localhost:3000/?delay=2000')

    // wait for todos call
    cy.wait('@todos')
    // confirm there are no items on the page
    cy.get('li.todo').should('have.length', 0)
  })

  it('starts with zero items (delay plus render delay)', () => {
    // spy on the GET /todos call and give it an alias
    cy.intercept('GET', '/todos').as('todos')
    // visit the page with query parameters
    // to delay the GET call and delay rendering the received items
    // /?delay=2000&renderDelay=1500
    cy.visit('localhost:3000/?delay=2000&renderDelay=1500')
    // wait for the network call to happen
    cy.wait('@todos')
    // confirm there are no todos
    // Question: can the items appear on the page
    // AFTER you have checked?
    cy.get('li.todo').should('have.length', 0)
  })

  it('starts with zero items (check body.loaded)', () => {
    // cy.visit('localhost:3000')
    // or use delays to simulate the delayed load and render
    cy.visit('localhost:3000/?delay=5000&renderDelay=5500')
    // the application sets "loaded" class on the body
    // in the test we can check for this class.
    // Increase the command timeout to prevent flaky tests
    cy.get('body', { timeout: 7_000 }).should('have.class', 'loaded')
    // then check the number of items
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
    cy.window().its('todos', { timeout: 7_000 })
    // then check the number of items rendered on the page
    cy.get('li.todo').should('have.length', 0)
  })

  it('starts with zero items (stubbed response)', () => {
    // start Cypress network server
    // spy on route `GET /todos`
    // THEN visit the page
    cy.intercept('GET', '/todos', []).as('todos')
    cy.visit('localhost:3000')
    cy.wait('@todos') // wait for `GET /todos` response
      // inspect the server's response
      .its('response.body')
      .should('have.length', 0)
    // then check the DOM
    cy.get('li.todo').should('have.length', 0)
  })

  it('starts with zero items (fixture)', () => {
    // stub route `GET /todos`, return data from fixture file
    // THEN visit the page
    cy.intercept('GET', '/todos', { fixture: 'empty-list.json' }).as('todos')
    cy.visit('localhost:3000')
    cy.wait('@todos') // wait for `GET /todos` response
      // inspect the server's response
      .its('response.body')
      .should('have.length', 0)
    // then check the DOM
    cy.get('li.todo').should('have.length', 0)
  })

  it.only('loads several items from a fixture', () => {
    // stub route `GET /todos` with data from a fixture file
    // THEN visit the page
    cy.intercept('GET', '/todos', { fixture: 'three-items' })
    cy.visit('localhost:3000')
    // then check the DOM: some items should be marked completed
    // we can do this in a variety of ways
    cy.get('li.todo').should('have.length', 2)
    cy.get('li.todo.completed').should('have.length', 1)
    cy.contains('.todo', 'first item from fixture')
      .should('not.have.class', 'completed')
      .find('.toggle')
      .should('not.be.checked')
    cy.contains('.todo.completed', 'second item from fixture')
      .find('.toggle')
      .should('be.checked')
  })

  it('confirms the request and the response', () => {
    // spy on "POST /todos", save as alias
    cy.intercept('POST', '/todos').as('new-item')
    cy.visit('localhost:3000')
    cy.get('.new-todo').type('test api{enter}')
    // wait for the intercept and verify its request body
    cy.wait('@new-item').its('request.body').should('deep.include', {
      title: 'test api',
      completed: false
    })
    // get the same intercept again and verify its response body
    cy.get('@new-item').its('response.body').should('deep.include', {
      title: 'test api',
      completed: false
    })
  })

  it('handles 404 when loading todos', () => {
    // when the app tries to load items
    // set it up to fail
    cy.intercept(
      {
        method: 'GET',
        pathname: '/todos'
      },
      {
        body: 'test does not allow it',
        statusCode: 404,
        delayMs: 2000
      }
    )
    cy.visit('localhost:3000', {
      // spy on console.error because we expect app would
      // print the error message there
      onBeforeLoad: (win) => {
        cy.spy(win.console, 'error').as('console-error')
      }
    })
    // observe external effect from the app - console.error(...)
    cy.get('@console-error').should(
      'have.been.calledWithExactly',
      'test does not allow it'
    )
  })

  // a test that confirms a specific network call is NOT made
  // until the application adds a new item
  it('does not make POST /todos request on load', () => {
    // a cy.spy() creates a "pass-through" function
    // that can function as a network interceptor that does nothing
    cy.intercept('POST', '/todos', cy.spy().as('post'))
    cy.visit('localhost:3000')
    // in order to confirm the network call was not made
    // we need to wait for something to happen, like the application
    // loading or some time passing
    cy.wait(1000)
    cy.get('@post').should('not.have.been.called')
    // add a new item through the page UI
    cy.get('.new-todo').type('a new item{enter}')
    // now the network call should have been made
    cy.get('@post')
      .should('have.been.calledOnce')
      // confirm the network call was made with the correct data
      // get the first object to the first call
      .its('args.0.0.body')
      .should('deep.include', {
        title: 'a new item',
        completed: false
      })
  })
})
