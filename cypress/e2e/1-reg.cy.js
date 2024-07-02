import {faker} from '@faker-js/faker'
import {registration} from '../pages/reg'
import {loginPage} from '../pages/login'
import {randomEmail, randomUsername} from '../support/helper'

const api_server = Cypress.env('api_server')
const existingEmail = Cypress.env('email')
const existingPass = Cypress.env('pass')
expect(api_server, 'api_server').to.be.a('string').and.not.be.empty

describe('Register new client negative', () => {
  it('Register new client without email', () => {
    const data = {
      password: '123',
      username: randomUsername,
    }
    registration.registerNewClient(api_server, data).then(response => {
      expect(response.status).eq(422)
      expect(response.body.errors.email).deep.eq(["can't be blank"])
    })
  })

  it('Register new client without username', () => {
    const data = {
      email: randomEmail,
      password: '123',
    }

    registration.registerNewClient(api_server, data).then(response => {
      expect(response.status).eq(422)
      expect(response.body.errors.username).deep.eq(["can't be blank"])
    })
  })

  it('Register new client without username and email', () => {
    const data = {
      password: '123',
    }
    registration.registerNewClient(api_server, data).then(response => {
      expect(response.status).eq(422)
      expect(response.body.errors.email).deep.eq(["can't be blank"])
    })
  })

  it('Register client with existiing email', () => {
    const data = {
      email: Cypress.env('email'),
      password: '123',
      username: randomUsername,
    }
    registration.registerNewClient(api_server, data).then(response => {
      expect(response.status).eq(422)
      expect(response.body.errors.email).deep.eq(['has already been taken'])
    })
  })

  it('Register client with existiing username', () => {
    loginPage
      .login(api_server, existingEmail, existingPass)
      .its('body.user.username')
      .then(username => {
        const data = {
          email: randomEmail,
          password: '123',
          username: username,
        }
        registration.registerNewClient(api_server, data).then(response => {
          expect(response.status).eq(422)
          expect(response.body.errors.username['has already been taken'])
        })
      })
  })
})
