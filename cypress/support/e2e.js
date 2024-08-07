import './commands'
import 'cypress-plugin-api'

const email = Cypress.env('email')
const pass = Cypress.env('pass')
const url = Cypress.env('api_server')

before('Getting the token', () => {
  cy.api({
    method: 'POST',
    url: `${url}/users/login`,
    body: {
      user: {
        email: email,
        password: pass,
      },
    },
  }).then(response => {
    Cypress.env('token', response.body.user.token)
    cy.api({
      method: 'GET',
      url: `${url}/user`,
      headers: {
        Authorization: 'Token ' + Cypress.env('token'),
      },
    }).then(response => {
      Cypress.env('userId', response.body.user.id)
    })
  })
})
