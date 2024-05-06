const { defineConfig } = require("cypress");

module.exports = defineConfig({
  failOnStatusCode: false,
  watchForFileChanges:false,
  e2e: {
  
    setupNodeEvents(on, config) {
      config.env.failOnStatusCode = false
      // implement node event listeners here
      return config;
    },
  },
});
