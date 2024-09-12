const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // `on` is used to hook into various events Cypress emits
      // "cy.task" can be used from specs to "jump" into Node environment
      // and doing anything you might want. For example, checking "data.json" file!
      // https://on.cypress.io/task
      on('task', {
        // saves given or default empty data object into todomvc/data.json file
        // if the server is watching this file, next reload should show the updated values
        async resetData(dataToSet = DEFAULT_DATA) {
          resetData(dataToSet)

          // add a small delay for the server to "notice"
          // the changed JSON file and reload
          await delay(100)

          // cy.task handlers should always return something
          // otherwise it might be an accidental return
          return null
        },

        hasSavedRecord(title, ms = 3000) {
          debug('inside task')
          console.log(
            'looking for title "%s" in the database (time limit %dms)',
            title,
            ms
          )
          return hasRecordAsync(title, ms)
        },

        /**
         * Call this method using cy.task('getSavedTodos') command.
         * Make sure the backend had plenty of time to save the data.
         */
        getSavedTodos() {
          const s = fs.readFileSync(getDbFilename(), 'utf8')
          const data = JSON.parse(s)
          console.log('returning %d saved todos', data.todos.length)
          return data.todos
        }
      })

      on('before:spec', (spec) => {
        console.log('resetting DB before spec %s', spec.name)
        resetData()
      })
    }
  }
})
