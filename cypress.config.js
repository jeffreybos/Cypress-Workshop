const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // `on` is used to hook into various events Cypress emits
      // "cy.task" can be used from specs to "jump" into Node environment
      // and doing anything you might want. For example, checking "data.json" file!
      // https://on.cypress.io/task
    }
  }
})
