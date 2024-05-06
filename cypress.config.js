const { defineConfig } = require("cypress");

module.exports = defineConfig({
  failOnStatusCode: false,
  watchForFileChanges:false,
  e2e: {
  
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
