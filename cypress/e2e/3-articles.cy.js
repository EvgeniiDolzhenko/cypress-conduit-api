import {articlePage} from '../pages/articles'
import {tags, tag, description, articleInfo, title, comment} from '../support/helper'
const api_server = Cypress.env('api_server')
expect(api_server, 'api_server').to.be.a('string').and.not.be.empty

describe('Get all articles', () => {
  it('Verify list of the articles', () => {
    articlePage.getAllArticles(api_server, 'loggedIn').then(response => {
      expect(response.status).eq(200)
    })
  })
})

describe('Create new article, verify , delete E2E API', () => {
  before('Create new article', function () {
    articlePage.createNewArticle(title, description, articleInfo, tags).then(response => {
      expect(response.status).eq(201)
      expect(response.body.article.slug).include(`${title}-${Cypress.env('userId')}`)
    })
  })

  it('Verify new post status and slug', function () {
    articlePage.getArticleByTitle(title, 'loggedIn').then(response => {
      expect(response.status).eq(200)
      expect(response.body.article.slug).include(`${title}-${Cypress.env('userId')}`)
    })
  })

  it('Verify new post description and taglist lenght', function () {
    articlePage.getArticleByTitle(title, 'loggedIn').then(response => {
      expect(response.body.article.description).eq(description)
      expect(response.body.article.tagList).length(3)
    })
  })

  it('Delete created article', function () {
    articlePage.deleteArticle(title).should('have.property', 'status', 204)
    articlePage.getArticleByTitle(title, 'loggedIn').then(response => {
      expect(response.status).eq(404)
      expect(response.body.errors.article).deep.eq(['not found'])
    })
  })
})

describe('Get random article, add comment, verify new comment E2E API', () => {
  let getRandomArticle
  beforeEach('Get random article, add comment, verify comment added', () => {
    articlePage.getAllArticles(api_server, 'loggedIn').then(response => {
      const randomSlug = Cypress._.random(0, response.body.articles.length - 1)
      getRandomArticle = response.body.articles[randomSlug].slug
      articlePage
        .addComment(api_server, getRandomArticle, comment, 'loggedIn')
        .its('body.comment.id')
        .should('be.a', 'number')
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
  before('Create article with new tag', () => {
    articlePage.createNewArticle(title, description, articleInfo, tag).then(response => {
      cy.wrap(response.body.article.slug).as('articleSlug')
      expect(response.status).eq(201)
    })
  })

  it('Verify new article with tag', function () {
    articlePage.getArticleByTag(api_server, tag).then(response => {
      expect(response.status).eq(200)
      expect(response.body.articles[0].slug).eq(this.articleSlug)
      expect(response.body.articles[0].tagList).deep.eq(tag)
    })
    articlePage.deleteArticle(title).should('have.property', 'status', 204)
    articlePage.getArticleByTitle(title, 'loggedIn').then(response => {
      expect(response.status).eq(404)
      expect(response.body.errors.article).deep.eq(['not found'])
    })
  })
})

describe('Favorite article', () => {
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
      expect(response.body.article.favoritedBy[0].id).eq(Cypress.env('userId'))
    })
    articlePage.deleteArticle(title).should('have.property', 'status', 204)
  })
})

describe('Create Article and Verify Post is Unavailable for Logged-Out User', () => {
  before('Create new article', function () {
    articlePage
      .createNewArticle(title, description, articleInfo, tag)
      .should('deep.include', {status: 201})
      .then(response => {
        cy.wrap(response.body.article.slug).as('articleSlug')
      })
  })

  it('Verify Post is Unavailable for Logged-Out User', function () {
    articlePage
      .getArticleByTitle(this.articleSlug, 'loggedIn')
      .should('deep.include', {status: 404})
      .then(response => {
        expect(response.body.errors.article).deep.eq(['not found'])
      })
  })

  it('Delete article', function () {
    articlePage.deleteArticle(title).should('have.property', 'status', 204)
  })
})

describe('Create article with existing title name', () => {
  before('Create new article', function () {
    articlePage
      .createNewArticle(title, description, articleInfo, tag)
      .should('deep.include', {status: 201})
  })

  it('Create article with existing name', function () {
    articlePage
      .createNewArticle(title, description, articleInfo, tag)
      .should('deep.include', {status: 422})
      .then(response => {
        expect(response.body.errors.title).deep.eq(['must be unique'])
      })
  })

  it('Delete article', function () {
    articlePage.deleteArticle(title).should('have.property', 'status', 204)
  })
})

describe('Verify article limits',()=>{
  it('Verify default 10 limit posts',()=>{
    articlePage.getArticles(api_server, 'loggedIn','10').then((response)=>{
      expect(response.body.articles).to.be.an('array').that.has.lengthOf(10);
    })
  })
})
