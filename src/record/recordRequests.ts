import RequestCollection from "../utility/RequestCollection";
import sanitizeHeaders from "../utility/sanitizeHeaders";
import createFixtureFilename from "../utility/createFixtureFilename";
import EnvComponentManager from "../utility/EnvComponentManager";
import { ReplayConfig } from "../models";
import { CyHttpMessages, StaticResponse } from "cypress/types/net-stubbing";

export const beforeRecordFn = (configuration: ReplayConfig): RequestCollection => {
    const dynamicComponentManager = EnvComponentManager.fromEnvironment(configuration.dynamicRequestEnvComponents || [], Cypress.env);
    const requestCollection = new RequestCollection(dynamicComponentManager);

    cy.intercept(new RegExp(configuration.interceptPattern || ".*"), (request: CyHttpMessages.IncomingHttpRequest) => {
        const startTime = Date.now();

        const promise = new Promise<StaticResponse>((resolve) => {
            request.on("after:response", (response: CyHttpMessages.IncomingResponse) => {
                resolve({
                    body: response.body,
                    headers: sanitizeHeaders(response.headers),
                    statusCode: response.statusCode,
                    // Including a delay that matches how long the server took to response will help make tests more
                    // deterministic.
                    delay: Date.now() - startTime,
                });
            });
        });

        requestCollection.pushIncomingRequest(request, promise);
    });

    return requestCollection;
};

export const afterRecordFn = (requestCollection: RequestCollection) => {
    cy.then(() => requestCollection.resolveMap()).then((map) => {
        cy.writeFile(
            createFixtureFilename(Cypress.config().fixturesFolder as string, Cypress.spec.name, Cypress.currentTest.titlePath),
            JSON.stringify(map, null, 4)
        );
    });
};

export default function recordRequests(configuration: ReplayConfig) {
    let requestCollection: RequestCollection;

    beforeEach(() => {
        requestCollection = beforeRecordFn(configuration);
    });
    afterEach(() => afterRecordFn(requestCollection));
}
