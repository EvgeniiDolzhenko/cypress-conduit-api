const email = Cypress.env('email')
const pass = Cypress.env('pass')
const api_server = Cypress.env('api_server')
import {user} from '../pages/user'

import {faker} from '@faker-js/faker'

describe('Update user bio', () => {
  const bio = faker.lorem.sentences(1)
  it('Update bio status, id ', () => {
    user.updateUser('', '', bio, '', '').then(response => {
      expect(response.status).eq(200)
      cy.wrap(response.body.user.id).should('eq', 2980)
    })
  })

  it('Update bio token ', () => {
    user.updateUser('', '', bio, '', '').then(response => {
      cy.wrap(response.body.user.token).should('eq', Cypress.env('token'))
    })
  })

  it('Update bio verify email ', () => {
    user.updateUser('', '', bio, '', '').then(response => {
      cy.wrap(response.body.user.email).should('eq', email)
    })
  })
})

describe('Update username',()=>{
  const newName = `Eugene${Cypress._.random(0,99999)}`
  it('Update username and verify status code',()=>{
    user.updateUser('', newName, '', '', '').then(response => {
      expect(response.status).eq(200)
    })
  })


  it('Update username and verify status code',()=>{
    user.updateUser('', newName, '', '', '').then(response => {
      cy.wrap(response.body.user.username).should('eq', newName)
    })
  })

})
