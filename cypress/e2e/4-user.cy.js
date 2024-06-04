const email = Cypress.env('email')
const pass = Cypress.env('pass')
const api_server = Cypress.env('api_server')

import { log } from 'console'
import {articlePage} from '../pages/articles'
import {faker} from '@faker-js/faker'

describe('Update user',()=>{
it('Update bio ',()=>{
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
                    "bio": "bio",
                    "email": "",
                    "password": ""
                  }
              }
    }).then((response)=>{
        expect(response.status).eq(200)
    })

})
})