import { ReplayBDDConfig } from "../models";
import RequestCollection from "../utility/RequestCollection";
import { afterRecordFn, beforeRecordFn } from "../record/recordRequests";
import { After, Before } from "@badeball/cypress-cucumber-preprocessor";

export default function recordBDDRequests(configuration: ReplayBDDConfig) {
    const tags = configuration.recordTags || "@record";
    let requestCollection: RequestCollection;

    Before({ tags }, () => {
        requestCollection = beforeRecordFn(configuration);
    });
    After({ tags }, () => afterRecordFn(requestCollection));
}
