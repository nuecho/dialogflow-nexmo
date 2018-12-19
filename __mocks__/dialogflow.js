class SessionsClient {
  constructor() {
    this._descriptors = {};
  }

  sessionPath(projectId, sessionId) {
    return 'sessionPath';
  }

  environmentSessionPath(projectId, env, user, sessionId) {
    return 'environmentSessionPath';
  }

  detectIntent(request) {
    return new Promise(resolve =>
      resolve([
        { queryResult: { fulfillmentText: `fulfillmentText: ${request}` } }
      ])
    );
  }
}

const v2 = { SessionsClient: SessionsClient };
const v2beta1 = { SessionsClient: SessionsClient };

module.exports = { v2, v2beta1 };
