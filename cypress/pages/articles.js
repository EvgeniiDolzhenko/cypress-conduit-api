const api_server = Cypress.env('api_server')

class Article{

    createNewArticle(title,description,articleInfo,tags){
        return cy.api({
            method: "POST",
            url: `${api_server}/articles`,
            failOnStatusCode: false,
            headers:{
                Authorization: 'Token '+Cypress.env('token')
            },
            body:{
                "article": {
                    "title": title,
                    "description": description,
                    "body": articleInfo,
                    "tagList": tags
                }
            }
        })
    }

    getArtucleByTitle(title){
        return cy.api({
            method:'GET',
            failOnStatusCode: false,
            url:`${api_server}/articles/${title}-2980`,
            headers:{
                Authorization: 'Token '+Cypress.env('token')
            }
        })
    }

    deleteArticle(title){
        return cy.api({
            method:'DELETE',
            failOnStatusCode: false,
            url:`${api_server}/articles/${title}-2980`,
            headers:{
                Authorization: 'Token '+Cypress.env('token')
            }
        })
    }
    

}
export const articlePage = new Article()