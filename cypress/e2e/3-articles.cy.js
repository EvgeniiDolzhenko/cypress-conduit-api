const email = Cypress.env('email')
const pass = Cypress.env('pass')
const api_server = Cypress.env('api_server')

import { articlePage } from '../pages/articles'
import { faker} from '@faker-js/faker';
describe('Cet all articles',()=>{
    it('verify list of the articles',()=>{
            cy.api({
                method:'GET',
                url:`${api_server}/articles?limit=10&offset=0`,
                headers:{
                    Authorization: 'Token '+Cypress.env('token')
                }
            }).then((response)=>{
                expect(response.status).eq(200)
            })
    })
})

describe('Create new article, verify , edit, delete E2E API',()=>{
    const tags = ['fashion', 'art', 'music']
    const title = faker.lorem.words(1);
    const description = faker.lorem.sentences(1)
    const articleInfo = faker.lorem.sentences(3)
    it('Create new article',function(){
    articlePage.createNewArticle(title,description,articleInfo,tags)
        .then((response)=>{
            expect(response.status).eq(201)
            expect(response.body.article.slug).include(title+'-2980')
        })
    })

    it('verify new post status and slug',function(){
        articlePage.getArtucleByTitle(title)
        .then((response)=>{
            expect(response.status).eq(200)
            expect(response.body.article.slug).include(title+'-2980')
        })
    })
    it('verify new post description and taglist lenght',function(){
        articlePage.getArtucleByTitle(title)
        .then((response)=>{
            expect(response.body.article.description).eq(description)
            expect(response.body.article.tagList).length(3)
        })
    })
})