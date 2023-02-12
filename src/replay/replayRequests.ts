import { CyHttpMessages } from "cypress/types/net-stubbing";
import RequestCollection from "../utility/RequestCollection";
import createFixtureFilename, { createMergedFixtureFilename } from "../utility/createFixtureFilename";
import EnvComponentManager from "../utility/EnvComponentManager";
import Logger from "../utility/Logger";
import { ReplayConfig } from "../models";

export const beforeReplayFn = (configuration: ReplayConfig): Logger => {
    const dynamicComponentManager = EnvComponentManager.fromEnvironment(configuration.dynamicRequestEnvComponents || [], Cypress.env);
    const logger = new Logger();

    // Create a request collection from the fixture fix.
    cy.readFile(createFixtureFilename(Cypress.config().fixturesFolder as string, Cypress.spec.name, Cypress.currentTest.titlePath))
        .then((fileContents) => {
            const collection = new RequestCollection(dynamicComponentManager, logger);
            collection.appendFromFixture(fileContents);
            return collection;
        })

        // Optionally append an additional hand-crafted fixture file to merge into the request collection,
        // for cases where tests are non-deterministic or may otherwise require additional fixed requests in the
        // same collection format.
        .then((requestCollection) =>
            cy.wrap<Promise<RequestCollection>, RequestCollection>(
                new Promise<RequestCollection>((resolve) => {
                    cy.readFile(
                        createMergedFixtureFilename(
                            Cypress.config().fixturesFolder as string,
                            Cypress.spec.name,
                            Cypress.currentTest.titlePath
                        )
                    ).should((mergeFixture) => {
                        if (mergeFixture) {
                            requestCollection.appendFromFixture(mergeFixture);
                        }
                        resolve(requestCollection);
                    });
                }),
                { log: false }
            )
        )

        // Start interception based on the resolved request collection.
        .then((requestCollection) => {
            cy.intercept(new RegExp(configuration.interceptPattern || ".*"), async (req: CyHttpMessages.IncomingHttpRequest) => {
                const fixtureResponse = await requestCollection.shiftRequest(req);
                if (fixtureResponse) {
                    req.reply({
                        ...fixtureResponse,
                        delay:
                            configuration.responseDelayOverride !== undefined ? configuration.responseDelayOverride : fixtureResponse.delay,
                    });
                }
            });
        });

    return logger;
};

export const afterReplayFn = (logger: Logger): void => {
    logger.getAll().map((log) => cy.log(`cypress-replay: ${log.message}\n\n${JSON.stringify(log.context)}`));
};

export default function replayRequests(configuration: ReplayConfig) {
    let logger: Logger;

    beforeEach(() => {
        logger = beforeReplayFn(configuration);
    });

    afterEach(() => {
        afterReplayFn(logger);
    });
}
