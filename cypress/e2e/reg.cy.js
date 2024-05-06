import {  faker } from '@faker-js/faker';

const api_server = Cypress.env('api_server')

describe('Register new client',()=>{

    const email = faker.internet.email()
    const username = faker.person.fullName()

    it('positive new user',()=>{
        cy.api({
            method:'POST',
            url: `${api_server}/users`,
            body: {
                "user": {
                  "email": email,
                  "password": "123",
                  "username": username
                }
              }
        }).then((response)=>{
            console.log(response.body.user.id);
            expect(response.body.user.id).a('number')
            expect(response.status).eq(201)
            expect(response.body.user.email).eq(email)
            expect(response.body.user.username).eq(username)
            expect(response.body.user.token).a('string')
        })

    })
})