///<reference types="cypress-plugin-api" />
const api_server = Cypress.env('api_server')
class User {
  updateUser(user) {
    return cy.api({
      method: 'PUT',
      url: `${api_server}/user`,
      headers: {
        Authorization: 'Token ' + Cypress.env('token'),
      },
      body: {
        user,
      },
    })
  }

  getUserInfo(){
    return cy.api({
      method: 'GET',
      url: `${api_server}/user`,
      headers: {
        Authorization: 'Token ' + Cypress.env('token'),
      },
    })
  }

  getUserArticles(username){
    return cy.api({
      method: 'GET',
      url: `${api_server}/articles?author=${username}&limit=10&offset=0`,
      headers: {
        Authorization: 'Token ' + Cypress.env('token'),
      },
    })
  }
}
export const user = new User()
