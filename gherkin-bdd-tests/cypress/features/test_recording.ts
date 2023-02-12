import {Given, Then, When} from "@badeball/cypress-cucumber-preprocessor";
import {enableCypressGherkinReplay} from "../../../src";

enableCypressGherkinReplay({responseDelayOverride: 0 });

Given("I visit example.cypress.io", () => {
    cy.visit('https://example.cypress.io/commands/network-requests')
});

When("I click navigation button", () => {
    cy.get('.network-btn').click();
});

When("I click post button", () => {
    cy.get('.network-post').click();
});

When("I click put button", () => {
    cy.get('.network-put').click();
});

Then(/I see "(.*)" in the content/, ([text]) => {
    cy.get('body').contains(text);
});
