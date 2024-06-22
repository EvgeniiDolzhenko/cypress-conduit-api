const { defineConfig } = require("cypress");
const cypressSplit = require('cypress-split')

module.exports = defineConfig({
  failOnStatusCode: false,
  watchForFileChanges:false,
  e2e: {
    setupNodeEvents(on, config) {
      cypressSplit(on, config)
      return config
    },
  },
});
