const email = Cypress.env('email')
const pass = Cypress.env('pass')
const api_server = Cypress.env('api_server')
import {user} from '../pages/user'

import {faker} from '@faker-js/faker'

describe('Update user bio', () => {
  const bio = faker.lorem.sentences(1)
  it('Update bio. Verify status, id, token,email', () => {
    user
      .updateUser({bio})
      .should('deep.include', {status: 200})
      .its('body.user')
      .should('deep.include', {
        id: 2980,
        token: Cypress.env('token'),
        email,
        bio,
      })
  })
})

describe('Update username', () => {
  const newName = `Eugene${Cypress._.random(0, 99999)}`
  it('Update username, verify status code, new name', () => {
    user
      .updateUser({username: newName})
      .should('deep.include', {status: 200})
      .its('body.user')
      .should('have.property', 'username', newName)
  })
})
