export interface ReplayConfig {
    interceptPattern?: string;
    dynamicRequestEnvComponents?: Array<string>;
    responseDelayOverride?: number;
    errorOnMissingResponse?: boolean;
}

export enum ReplayMode {
    Recording,
    Replaying,
}

export interface ReplayBDDConfig extends ReplayConfig {
    recordTags?: string;
    replayTags?: string;
}
