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

describe('Register new client negative',()=>{
    const email = faker.internet.email()
    const username = faker.person.fullName()

    it('Register new client without email',()=>{
        cy.api({
            method:'POST',
            url: `${api_server}/users`,
            failOnStatusCode:false,
            body: {
                "user": {
                  "password": "123",
                  "username": username
                }
              }
        }).then((response)=>{
            expect(response.status).eq(422)
            expect(response.body.errors.email).deep.eq(["can't be blank"])
        })
    })

    it('Register new client without username',()=>{
        cy.api({
            method:'POST',
            url: `${api_server}/users`,
            failOnStatusCode:false,
            body: {
                "user": {
                    "email": email,
                    "password": "123",
                }
              }
        }).then((response)=>{
            expect(response.status).eq(422)
            expect(response.body.errors.username).deep.eq(["can't be blank"])
        })
    })
})