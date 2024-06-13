///<reference types="cypress-plugin-api" />

export class Registration {
  registerNewClient(url, data) {
    return cy.api({
      method: 'POST',
      url: `${url}/users`,
      failOnStatusCode: false,
      body: {
        user: data,
      },
    })
  }
}
export const registration = new Registration()
