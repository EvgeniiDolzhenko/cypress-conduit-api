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

describe('Get random article, add comment, verify new comment E2E API', () => {
  const comment = faker.lorem.sentences(1)
  let commentId
  let getRandomArticle
  it('Get random article, add comment, verify comment added', () => {
    articlePage.getAllArticles(api_server).then(response => {
      const randomSlug = Cypress._.random(0, response.body.articles.length - 1)
      getRandomArticle = response.body.articles[randomSlug].slug
      articlePage.addComment(api_server, getRandomArticle, comment).then(res => {
        commentId = res.body.comment.id
        cy.wrap(response.body.articles[randomSlug].slug).then(randomArticle => {
          articlePage.getAllCommentsFromArticle(api_server, randomArticle).then(response => {
            const ids = []
            for (let i = 0; i < response.body.comments.length; i++) {
              ids.push(response.body.comments[i].id)
            }
            expect(ids).to.include(commentId)
          })
        })
      })
    })
  })

  it('Delete comment', () => {
    articlePage.deleteComment(api_server, getRandomArticle, commentId).then(res => {
      expect(res.status).eq(200)
    })
  })

  it('Verify deleted comment', () => {
    articlePage.getAllCommentsFromArticle(api_server, getRandomArticle).then(response => {
      const ids = []
      for (let i = 0; i < response.body.comments.length; i++) {
        ids.push(response.body.comments[i].id)
      }
      expect(ids).not.to.include(commentId)
    })
  })
})

describe('Getting article by tag', () => {
  const tags = [faker.lorem.words(1)]
  const title = faker.lorem.words(1)
  const description = faker.lorem.sentences(1)
  const articleInfo = faker.lorem.sentences(3)
  let articleSlug
  it('Create article with new tag', () => {
    articlePage.createNewArticle(title, description, articleInfo, tags).then(response => {
      articleSlug = response.body.article.slug
      expect(response.status).eq(201)
    })
  })

  it('verify new article with tag', () => {
    articlePage.getArticleByTag(api_server, tags).then(response => {
      expect(response.status).eq(200)
      expect(response.body.articles[0].slug).eq(articleSlug)
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
