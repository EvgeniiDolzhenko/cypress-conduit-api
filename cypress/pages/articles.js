///<reference types="cypress-plugin-api" />
const api_server = Cypress.env('api_server')

class Article {
  createNewArticle(title, description, articleInfo, tags) {
    return cy.api({
      method: 'POST',
      url: `${api_server}/articles`,
      failOnStatusCode: false,
      headers: {
        Authorization: 'Token ' + Cypress.env('token'),
      },
      body: {
        article: {
          title: title,
          description: description,
          body: articleInfo,
          tagList: tags,
        },
      },
    })
  }

  getArticleByTitle(title, permission) {
    if (permission === 'loggedIn') {
      return cy.api({
        method: 'GET',
        failOnStatusCode: false,
        url: `${api_server}/articles/${title}-2980`,
        headers: {
          Authorization: 'Token ' + Cypress.env('token'),
        },
      })
    } else {
      return cy.api({
        method: 'GET',
        failOnStatusCode: false,
        url: `${api_server}/articles/${title}-2980`,
      })
    }
  }

  deleteArticle(title) {
    return cy.api({
      method: 'DELETE',
      failOnStatusCode: false,
      url: `${api_server}/articles/${title}-2980`,
      headers: {
        Authorization: 'Token ' + Cypress.env('token'),
      },
    })
  }

  getAllArticles(api_server, permission) {
    if (permission === 'loggedIn') {
      return cy.api({
        method: 'GET',
        url: `${api_server}/articles?limit=10&offset=0`,
        headers: {
          Authorization: 'Token ' + Cypress.env('token'),
        },
      })
    } else {
      return cy.api({
        method: 'GET',
        url: `${api_server}/articles?limit=10&offset=0`,
      })
    }
  }

  addComment(api_server, title, comment) {
    const options = {
      method: 'POST',
      url: `${api_server}/articles/${title}/comments`,
      headers: {
        Authorization: 'Token ' + Cypress.env('token'),
      },
      body: {
        comment: {
          body: comment,
        },
      },
    };
    return cy.api(options);
  }

  getAllCommentsFromArticle(api_server, title) {
    expect(title).to.be.a('string')
    return cy.api({
      method: 'GET',
      url: `${api_server}/articles/${title}/comments`,
      headers: {
        Authorization: 'Token ' + Cypress.env('token'),
      },
    })
  }

  deleteComment(api_server, title, commentId) {
    return cy.api({
      method: 'DELETE',
      url: `${api_server}/articles/${title}/comments/${commentId}`,
      headers: {
        Authorization: 'Token ' + Cypress.env('token'),
      },
    })
  }

  getArticleByTag(api_server, tag) {
    return cy.api({
      method: 'GET',
      failOnStatusCode: false,
      url: `${api_server}/articles?tag=${tag}&limit=10&offset=0`,
      headers: {
        Authorization: 'Token ' + Cypress.env('token'),
      },
    })
  }

  favoriteArticle(title) {
    return cy.api({
      method: 'POST',
      failOnStatusCode: false,
      url: `${api_server}/articles/${title}/favorite`,
      body: {},
      headers: {
        Authorization: 'Token ' + Cypress.env('token'),
      },
    })
  }
}
export const articlePage = new Article()
