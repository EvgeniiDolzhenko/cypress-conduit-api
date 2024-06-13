import {loginPage} from '../pages/login'

const email = Cypress.env('email')
const pass = Cypress.env('pass')
const api_server = Cypress.env('api_server')
expect(email, 'email').to.be.a('string').and.not.be.empty
expect(pass, 'pass').to.be.a('string').and.not.be.empty
expect(api_server, 'api_server').to.be.a('string').and.not.be.empty

describe('Positive scenario', () => {
  it('login succses status code, token', () => {
    loginPage.login(api_server, email, pass).then(response => {
      expect(response.status).eq(200)
      cy.wrap(response.body.user.token).should('be.a', 'string')
    })
  })
})

describe('Negative scenario', () => {
  it('invalid email', () => {
    loginPage.loginNegative(api_server, 'invalidEmail', pass).then(response => {
      expect(response.status).eq(403)
      expect(response.body.errors['email or password']).deep.eq(['is invalid'])
    })
  })

  it('Invalid password', () => {
    loginPage.loginNegative(api_server, email, 'invalid_pass').then(response => {
      cy.wrap(response.status).should('eq', 403)
      expect(response.body.errors['email or password']).deep.eq(['is invalid'])
    })
  })
})
