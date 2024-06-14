///<reference types="cypress-plugin-api" />

class User {
  updateUser(user) {
    return cy.api({
      method: 'PUT',
      url: 'https://conduit-api.bondaracademy.com/api/user',
      headers: {
        Authorization: 'Token ' + Cypress.env('token'),
      },
      body: {
        user,
      },
    })
  }
}
export const user = new User()
