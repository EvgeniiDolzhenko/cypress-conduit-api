const email = Cypress.env('email')
const pass = Cypress.env('pass')
const api_server = Cypress.env('api_server')

import {articlePage} from '../pages/articles'
import {faker} from '@faker-js/faker'
describe('Get all articles', () => {
  it('verify list of the articles', () => {
    articlePage.getAllArticles(api_server).then(response => {
      expect(response.status).eq(200)
    })
  })
})

describe('Create new article, verify , delete E2E API', () => {
  const tags = ['fashion', 'art', 'music']
  const title = faker.lorem.words(1)
  const description = faker.lorem.sentences(1)
  const articleInfo = faker.lorem.sentences(3)
  it('Create new article', function () {
    articlePage.createNewArticle(title, description, articleInfo, tags).then(response => {
      expect(response.status).eq(201)
      expect(response.body.article.slug).include(title + '-2980')
    })
  })
  it('verify new post status and slug', function () {
    articlePage.getArtucleByTitle(title).then(response => {
      expect(response.status).eq(200)
      expect(response.body.article.slug).include(title + '-2980')
    })
  })
  it('verify new post description and taglist lenght', function () {
    articlePage.getArtucleByTitle(title).then(response => {
      expect(response.body.article.description).eq(description)
      expect(response.body.article.tagList).length(3)
    })
  })
  it('delete created article', function () {
    articlePage.deleteArticle(title).then(response => {
      expect(response.status).eq(204)
    })
  })
  it('Verify deleted article', function () {
    articlePage.getArtucleByTitle(title).then(response => {
      expect(response.status).eq(404)
      expect(response.body.errors.article).deep.eq(['not found'])
    })
  })
})

describe('Get random article, edit, verify edited article E2E API', () => {
  it('Get random article', () => {
    articlePage.getAllArticles(api_server).then(response => {
      const randomSlug = Cypress._.random(0, response.body.articles.length - 1)
      console.log(response.body.articles[randomSlug])
    })
  })
})
