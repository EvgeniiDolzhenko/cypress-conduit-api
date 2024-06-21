import {faker} from '@faker-js/faker'
import {registration} from '../pages/reg'
import {loginPage} from '../pages/login'
const api_server = Cypress.env('api_server')
const existingEmail = Cypress.env('email')
const existingPass = Cypress.env('pass')
expect(api_server, 'api_server').to.be.a('string').and.not.be.empty

describe('Register new client negative', () => {
  const email = faker.internet.email()
  const username = faker.person.fullName()
  it('Register new client without email', () => {
    const data = {
      password: '123',
      username: username,
    }
    registration.registerNewClient(api_server, data).then(response => {
      expect(response.status).eq(422)
      expect(response.body.errors.email).deep.eq(["can't be blank"])
    })
  })

  it('Register new client without username', () => {
    const data = {
      email: email,
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
    const newUsername = faker.person.fullName()
    const data = {
      email: Cypress.env('email'),
      password: '123',
      username: newUsername,
    }
    registration.registerNewClient(api_server, data).then(response => {
      expect(response.status).eq(422)
      expect(response.body.errors.email['has already been taken'])
    })
  })

  it('Register client with existiing username', () => {
    const newEmail = faker.internet.email()
    loginPage
      .login(api_server, existingEmail, existingPass)
      .its('body.user.username')
      .then(username => {
        const data = {
          email: newEmail,
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
