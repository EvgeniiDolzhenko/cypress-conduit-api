const email = Cypress.env('email')
const api_server = Cypress.env('api_server')
import {tags, articleInfo, description} from '../support/helper'
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
  const title = faker.lorem.words(1) + `${Cypress._.random(0, 999)}`
  beforeEach('Create new article', function () {
    articlePage
      .createNewArticle(title, description, articleInfo, tags)
      .should('deep.include', {status: 201})
      .its('body.article.slug')
      .then(newArticle => {
        cy.wrap(newArticle).as('newArticle')
        articlePage
          .getAllArticles(api_server, 'loggedIn')
          .its('body.articles')
          .then(articles => {
            const slugs = articles.map(article => article.slug)
            expect(slugs).to.include(newArticle)
          })
      })
  })

  it(' Verify the post does not exist for a logged-out user.', function () {
    articlePage
      .getAllArticles(api_server, 'loggedOut')
      .its('body.articles')
      .then(articles => {
        const slugs = articles.map(article => article.slug)
        expect(slugs).not.include(this.newArticle)
      })
    articlePage.deleteArticle(title).should('have.property', 'status', 204)
  })

  it('Verify that the post is visible when retrieving the article by title for a logged-out user.', function () {
    articlePage
      .getArticleByTitle(title, 'loggedOut')
      .should('deep.include', {status: 200})
      .its('body.article.slug')
      .should('eq', this.newArticle)
    articlePage.deleteArticle(title).should('have.property', 'status', 204)
  })
})

describe('Verify user posts amount', () => {
  const title = faker.lorem.words(1) + `${Cypress._.random(0, 999)}`
  before('Get username, get all user articles', function () {
    user
      .getUserInfo()
      .its('body.user.username')
      .then(username => {
        cy.wrap(username).as('username')
        user
          .getUserArticles(username)
          .its('body.articlesCount')
          .then(articlesCount => {
            cy.wrap(articlesCount).as('articlesCount')
          })
      })
  })

  it('Creat new article and verify articlesCount has been changed', function () {
    articlePage
      .createNewArticle(title, description, articleInfo, tags)
      .should('deep.include', {status: 201})
    user
      .getUserArticles(this.username)
      .its('body.articlesCount')
      .then(newAmount => {
        expect(newAmount).not.eq(this.articlesCount)
        expect(newAmount).eq(this.articlesCount + 1)
      })
    articlePage.deleteArticle(title).should('have.property', 'status', 204)
  })
})
