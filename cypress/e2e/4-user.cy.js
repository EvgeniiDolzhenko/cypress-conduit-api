const email = Cypress.env('email')
const pass = Cypress.env('pass')
const api_server = Cypress.env('api_server')

import {faker} from '@faker-js/faker'

describe('Update user',()=>{
    const bio = faker.lorem.sentences(1)
it('Update bio status, id ',()=>{
    cy.api({
        method:'PUT',
        url:'https://conduit-api.bondaracademy.com/api/user',
        headers: {
            Authorization: 'Token ' + Cypress.env('token'),
          },
        body:
            {
               user: {
                    "image": "",
                    "username": "",
                    "bio": bio,
                    "email": "",
                    "password": ""
                  }
              }
    }).then((response)=>{
        expect(response.status).eq(200)
        cy.wrap(response.body.user.id).should('eq',2980)
    })

})

it('Update bio token ',()=>{
    cy.api({
        method:'PUT',
        url:'https://conduit-api.bondaracademy.com/api/user',
        headers: {
            Authorization: 'Token ' + Cypress.env('token'),
          },
        body:
            {
               user: {
                    "image": "",
                    "username": "",
                    "bio": bio,
                    "email": "",
                    "password": ""
                  }
              }
    }).then((response)=>{
        cy.wrap(response.body.user.token).should('eq',Cypress.env('token'))
    })

})


})