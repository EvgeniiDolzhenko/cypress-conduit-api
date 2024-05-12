const email = Cypress.env('email')
const pass = Cypress.env('pass')
const api_server = Cypress.env('api_server')

describe('Articles positive',()=>{
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