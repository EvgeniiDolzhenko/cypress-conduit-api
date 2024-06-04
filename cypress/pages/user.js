class User {
  updateUser(image, username, bio, email, password) {
    return cy.api({
      method: 'PUT',
      url: 'https://conduit-api.bondaracademy.com/api/user',
      headers: {
        Authorization: 'Token ' + Cypress.env('token'),
      },
      body: {
        user: {
          image,
          username,
          bio,
          email,
          password,
        },
      },
    })
  }
}
export const user = new User()
