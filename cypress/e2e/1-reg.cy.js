import {faker} from '@faker-js/faker'
import {registration} from '../pages/reg'
const api_server = Cypress.env('api_server')
expect(api_server, 'api_server').to.be.a('string').and.not.be.empty

describe('Register new client', () => {
  const email = faker.internet.email()
  const username = faker.person.fullName()
  it('positive new user', () => {
    const data = {
      email: email,
      password: '123',
      username: username,
    }
    registration.registerNewClient(api_server, data).then(response => {
      expect(response.body.user.id).a('number')
      expect(response.status).eq(201)
      expect(response.body.user.email).eq(email)
      expect(response.body.user.username).eq(username)
      expect(response.body.user.token).a('string')
    })
  })
})

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
    const newEmail = faker.internet.email()
    const newUsername = faker.person.fullName()
    const random = Cypress._.random(1000, 99999)
    const data = {
      email: newEmail,
      password: '123',
      username: newUsername,
    }
    const dataRandomName = {
      email: newEmail,
      password: '123',
      username: newUsername + random,
    }
    registration
      .registerNewClient(api_server, data)
      .should('have.property', 'status', 201)
      .then(() => {
        registration.registerNewClient(api_server, dataRandomName).then(response => {
          expect(response.status).eq(422)
          expect(response.body.errors.email['has already been taken'])
        })
      })
  })

  it('Register client with existiin username', () => {
    const newEmail = faker.internet.email()
    const newUsername = faker.person.fullName()
    const random = Math.floor(100000 + Math.random() * 900000)
    const data = {
      email: newEmail,
      password: '123',
      username: newUsername,
    }
    const dataRandomMail = {
      email: newEmail + random,
      password: '123',
      username: newUsername,
    }
    registration
      .registerNewClient(api_server, data)
      .then(response => {
        expect(response.status).eq(201)
      })
      .then(() => {
        registration.registerNewClient(api_server, dataRandomMail).then(response => {
          expect(response.status).eq(422)
          expect(response.body.errors.username['has already been taken'])
        })
      })
  })
})
