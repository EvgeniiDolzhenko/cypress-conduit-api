// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import 'cypress-plugin-api'
// Alternatively you can use CommonJS syntax:
// require('./commands')
const email = Cypress.env('email')
const pass = Cypress.env('pass')
const url = Cypress.env('api_server')
before('Getting the token',()=>{
    cy.api({
        method:'POST',
        url:`${url}/users/login`,
        body:{
            "user": {
              "email": email,
              "password": pass
          }
        }
      }).then((response)=>{
        Cypress.env('token',response.body.user.token)
      })
})
