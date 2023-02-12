import { CyHttpMessages } from "cypress/types/net-stubbing";

export default function createRequestKey(request: CyHttpMessages.IncomingRequest) {
    const keyComponents = [request.method, request.url];

    if (typeof request.body === "object") {
        keyComponents.push(JSON.stringify(request.body));
    }

    return keyComponents.join(":");
}
