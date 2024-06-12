///<reference types="cypress-plugin-api" />

class LoginPage {
  login(url, email, pass) {
    return cy
      .api({
        method: 'POST',
        url: `${url}/users/login`,
        body: {
          user: {
            email: email,
            password: pass,
          },
        },
      })
      .then(response => {
        Cypress.env('token', response.body.user.token)
      })
  }

  loginNegative(api_server, email, password) {
    return cy.api({
      method: 'POST',
      url: `${api_server}/users/login`,
      failOnStatusCode: false,
      body: {
        user: {
          email,
          password,
        },
      },
    })
  }
}
export const loginPage = new LoginPage()
