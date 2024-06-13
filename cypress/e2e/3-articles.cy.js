import {articlePage} from '../pages/articles'
import {faker} from '@faker-js/faker'

const api_server = Cypress.env('api_server')
expect(api_server, 'api_server').to.be.a('string').and.not.be.empty

describe('Get all articles', () => {
  it('verify list of the articles', () => {
    articlePage.getAllArticles(api_server).then(response => {
      expect(response.status).eq(200)
    })
  })
})

describe.only('Create new article, verify , delete E2E API', () => {
  const tags = ['fashion', 'art', 'music']
  const title = faker.lorem.words(1)
  const description = faker.lorem.sentences(1)
  const articleInfo = faker.lorem.sentences(3)

  before('Create new article', function () {
    articlePage.createNewArticle(title, description, articleInfo, tags).then(response => {
      expect(response.status).eq(201)
      expect(response.body.article.slug).include(title + '-2980')
    })
  })

  it('verify new post status and slug', function () {
    articlePage.getArticleByTitle(title).then(response => {
      expect(response.status).eq(200)
      expect(response.body.article.slug).include(title + '-2980')
    })
  })

  it('verify new post description and taglist lenght', function () {
    articlePage.getArticleByTitle(title).then(response => {
      expect(response.body.article.description).eq(description)
      expect(response.body.article.tagList).length(3)
    })
  })

  it('delete created article', function () {
    articlePage.deleteArticle(title).should('have.property', 'status', 204)
    articlePage.getArticleByTitle(title).then(response => {
      expect(response.status).eq(404)
      expect(response.body.errors.article).deep.eq(['not found'])
    })
  })

})

describe('Get random article, add comment, verify new comment E2E API', () => {
  const comment = faker.lorem.sentences(1)
  let getRandomArticle
  beforeEach('Get random article, add comment, verify comment added', () => {
    articlePage.getAllArticles(api_server).then(response => {
      const randomSlug = Cypress._.random(0, response.body.articles.length - 1)
      getRandomArticle = response.body.articles[randomSlug].slug
      articlePage
        .addComment(api_server, getRandomArticle, comment)
        .its('body.comment.id')
        .should('be.a','number')
        .as('commentId')
        .then(commentId => {
          articlePage
            .getAllCommentsFromArticle(api_server, getRandomArticle)
            .its('body.comments')
            .then(comments => {
              const ids = []
              for (let i = 0; i < comments.length; i++) {
                ids.push(comments[i].id)
              }
              expect(ids).to.include(commentId)
            })
        })
    })
  })

  it('Verify deleted comment', function () {
    articlePage
      .deleteComment(api_server, getRandomArticle, this.commentId)
      .should('have.property', 'status', 200)
    articlePage
      .getAllCommentsFromArticle(api_server, getRandomArticle)
      .its('body.comments')
      .then(comments => {
        const ids = []
        for (let i = 0; i < comments.length; i++) {
          ids.push(comments[i].id)
        }
        expect(ids).not.to.include(this.commentId)
      })
  })
})

describe('Getting article by tag', () => {
  const tag = [faker.lorem.words(1)]
  const title = faker.lorem.words(1)
  const description = faker.lorem.sentences(1)
  const articleInfo = faker.lorem.sentences(3)

  before('Create article with new tag', () => {
    articlePage.createNewArticle(title, description, articleInfo, tag).then(response => {
      cy.wrap(response.body.article.slug).as('articleSlug')
      expect(response.status).eq(201)
    })
  })

  it('verify new article with tag', function () {
    articlePage.getArticleByTag(api_server, tag).then(response => {
      expect(response.status).eq(200)
      expect(response.body.articles[0].slug).eq(this.articleSlug)
      expect(response.body.articles[0].tagList).deep.eq(tag)
    })
    articlePage.deleteArticle(title).should('have.property', 'status', 204)
    articlePage.getArticleByTitle(title).then(response => {
      expect(response.status).eq(404)
      expect(response.body.errors.article).deep.eq(['not found'])
    })
  })
})

describe('Favorite article', () => {
  const tag = [faker.lorem.words(1)]
  const title = faker.lorem.words(1)
  const description = faker.lorem.sentences(1)
  const articleInfo = faker.lorem.sentences(3)

  before('Create new article', () => {
    articlePage.createNewArticle(title, description, articleInfo, tag).then(response => {
      cy.wrap(response.body.article.slug).as('articleSlug')
      cy.wrap(response.status).should('eq', 201)
      expect(response.body.article.favoritesCount).eq(0)
      expect(response.body.article.favorited).eq(false)
    })
  })

  it('Verify article is favorite', function () {
    articlePage.favoriteArticle(this.articleSlug).then(response => {
      expect(response.body.article.favoritesCount).eq(1)
      expect(response.body.article.favorited).eq(true)
      expect(response.body.article.favoritedBy[0].id).eq(2980)
    })
    articlePage.deleteArticle(title).should('have.property', 'status', 204)
  })
})
