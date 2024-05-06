const email = Cypress.env('email')
const pass = Cypress.env('pass')

describe('Positive scenario', () => {
  it('login succses status code, token', () => {
    cy.api({
      method:'POST',
      url:'https://conduit-api.bondaracademy.com/api/users/login',
      body:{
          "user": {
            "email": email,
            "password": pass
        }
      }
    }).then((response)=>{
      expect(response.status).eq(200)
      cy.wrap(response.body.user.token).should('be.a','string')
    })
  })
})

describe('Negative scenario',()=>{

  it('invalid email',()=>{
    cy.api({
      method:'POST',
      url:'https://conduit-api.bondaracademy.com/api/users/login',
      failOnStatusCode:false,
      body:{
          "user": {
            "email": "invalid",
            "password": pass
        }
      }
    }).then((response)=>{
      expect(response.status).eq(403)
      expect(response.body.errors['email or password']).deep.eq(['is invalid'])
    })
  })

  it('Invalid password',()=>{
    cy.api({
      method:'POST',
      url:'https://conduit-api.bondaracademy.com/api/users/login',
      failOnStatusCode:false,
      body:{
          "user": {
            "email": email,
            "password": "eugene1"
        }
      }
    }).then((response)=>{
      cy.wrap(response.status).should('eq',403)
      expect(response.body.errors['email or password']).deep.eq(['is invalid'])
    })
  })
})