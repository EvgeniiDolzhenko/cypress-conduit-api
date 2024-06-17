const email = Cypress.env('email')
const pass = Cypress.env('pass')
const api_server = Cypress.env('api_server')

import {articlePage} from '../pages/articles'
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

describe('Update image', () => {
  it('Update image, verify status code, new image url', () => {
    user
      .updateUser({image: 'testUrl'})
      .should('deep.include', {status: 200})
      .its('body.user')
      .should('have.property', 'image', 'testUrl')
  })
})

describe('Create a new post ->Verify the post appears in the feed -> Verify the post is not visible to a logged-out user. ', () => {
  const tags = ['fashion', 'art', 'music']
  const title = faker.lorem.words(1)
  const description = faker.lorem.sentences(1)
  const articleInfo = faker.lorem.sentences(3)

  before('Create new article', function () {
    articlePage
      .createNewArticle(title, description, articleInfo, tags)
      .should('deep.include', {status: 201})
      .its('body.article.slug')
      .then(newSlug => {
        cy.wrap(newSlug).as('newSlug')
        articlePage
          .getAllArticles(api_server, 'loggedIn')
          .its('body.articles')
          .then(articles => {
            const slugs = articles.map(article => article.slug)
            expect(slugs).to.include(newSlug)
          })
      })
  })

  it(' Verify the post is not visible to a logged-out user.', function () {
    articlePage
      .getAllArticles(api_server, 'loggedOut')
      .its('body.articles')
      .then(articles => {
        const slugs = articles.map(article => article.slug)
        expect(slugs).not.include(this.newSlug)
      })
    articlePage.deleteArticle(title).should('have.property', 'status', 204)
  })
})
