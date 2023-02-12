import recordRequests from "./record/recordRequests";
import replayRequests from "./replay/replayRequests";
import loadConfiguration from "./utility/loadConfiguration";
import { ReplayBDDConfig, ReplayConfig, ReplayMode } from "./models";
import recordBDDRequests from "./gherkin/recordRequestBDD";
import replayBDDRequests from "./gherkin/replayRequestsBDD";

export { ReplayBDDConfig, ReplayConfig, ReplayMode };

export default function enableCypressReplay(mode: ReplayMode | null = null, config: ReplayConfig = {}) {
    const replayMode = mode !== null ? mode : Cypress.env("REPLAY_RECORD_REQUESTS") ? ReplayMode.Recording : ReplayMode.Replaying;

    // Allow the configuration to be defined globally and then to be overridden on a test by test basis.
    const configuration = {
        ...loadConfiguration(),
        ...config,
    };

    if (replayMode === ReplayMode.Recording) {
        recordRequests(configuration);
    }
    if (replayMode === ReplayMode.Replaying) {
        replayRequests(configuration);
    }
}

export function enableCypressGherkinReplay(config: ReplayBDDConfig = {}) {
    // Allow the configuration to be defined globally and then to be overridden on a test by test basis.
    const configuration = {
        ...loadConfiguration(),
        ...config,
    };

    recordBDDRequests(configuration);
    replayBDDRequests(configuration);
}
