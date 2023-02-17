import { ReplayBDDConfig } from "../models";
import Logger from "../utility/Logger";
import { afterReplayFn, beforeReplayFn } from "../replay/replayRequests";
import { After, Before } from "@badeball/cypress-cucumber-preprocessor";

export default function replayBDDRequests(configuration: ReplayBDDConfig) {
    const tags = configuration.replayTags || "@replay and not @record";
    let logger: Logger;

    Before({ tags }, () => {
        logger = beforeReplayFn(configuration);
    });

    After({ tags }, () => {
        afterReplayFn(logger);
    });
}
