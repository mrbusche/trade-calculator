describe('check trade calc', () => {
    it('check homepage', () => {
        cy.visit('https://dynasty-trade-calculator.netlify.app/');
        cy.get('h1').should('have.text', 'Dynasty Trade Calculator');
        cy.get('#winner').should('have.text', 'Please choose players for each team.');

        cy.get('#teamOne option').should('have.length.of.at.least', 300)
        cy.get('#teamTwo option').should('have.length.of.at.least', 300)
    })

})
