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
}
export const loginPage = new LoginPage()
