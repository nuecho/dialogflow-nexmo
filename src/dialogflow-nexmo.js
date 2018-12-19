'use strict';

// A middleware to connect Nexmo to Dialogflow.

const util = require('util');
const _ = require('lodash');
const Nexmo = require('nexmo');

const dialogflowBeta = require('dialogflow').v2beta1;
const dialogflow = require('dialogflow').v2;

const DEFAULT_USER = '-';
const DEFAULT_THROTTLING_MS = '500';
const DEFAULT_LANGUAGE = 'en-US';

const DIALOGFLOW_REQUIRED_FIELDS = ['projectId'];

const NEXMO_REQUIRED_FIELDS = ['apiKey', 'apiSecret', 'did'];

///////////////////////////////
//
//      Public functions
//
///////////////////////////////

const connect = async (message, origination, options) => {
  checkOptions('dialogflow', options.dialogflow, DIALOGFLOW_REQUIRED_FIELDS);
  checkOptions('nexmo', options.nexmo, NEXMO_REQUIRED_FIELDS);
  console.log(`Received SMS: ${util.inspect(options)}`);
  console.log(`${origination} ==> ${message}`);
  return await queryDialogFlow(message, origination, options.dialogflow)
    .then(result => sendSmsResponse(result, origination, options.nexmo))
    .catch(error => {
      console.log(`An error occurred: ${util.inspect(error)}`);
      return false;
    });
};

module.exports = {
  connect,
  DIALOGFLOW_REQUIRED_FIELDS,
  NEXMO_REQUIRED_FIELDS
};

///////////////////////////////
//
//     Private functions
//
///////////////////////////////

const checkOptions = (type, options, requiredFields) => {
  const missing = [];

  _.each(requiredFields, field => {
    if (!options[field]) missing.push(` ${field}`);
  });

  if (missing.length)
    throw new Error(`Missing required ${type} fields:${missing}`);

  return true;
};

const createNexmoInstance = (apiKey, apiSecret) =>
  new Nexmo({ apiKey: apiKey, apiSecret: apiSecret });

const queryDialogFlow = (inputText, sessionId, options) =>
  new Promise((resolve, reject) => {
    const languageCode =
      options.languageCode !== undefined
        ? options.languageCode
        : DEFAULT_LANGUAGE;
    const sessionClient = getSessionClient(options.env);
    const request = {
      session: getSession(
        sessionClient,
        options.projectId,
        sessionId,
        options.env
      ),
      queryInput: buildQueryInput(inputText, languageCode)
    };

    return sessionClient
      .detectIntent(request)
      .then(responses => resolve(extractResponses(responses)))
      .catch(err => reject(console.error('ERROR:', err)));
  });

// If the `env` option is set, we are using the Beta API
const getSessionClient = env =>
  env ? new dialogflowBeta.SessionsClient() : new dialogflow.SessionsClient();

const getSession = (sessionClient, projectId, sessionId, env) =>
  env
    ? sessionClient.environmentSessionPath(
        projectId,
        env,
        DEFAULT_USER,
        sessionId
      )
    : sessionClient.sessionPath(projectId, sessionId);

const buildQueryInput = (inputText, languageCode) => {
  return {
    text: {
      text: inputText,
      languageCode: languageCode
    }
  };
};

const extractResponses = responses =>
  responses[0].queryResult.fulfillmentText ||
  _.flatMap(responses[0].queryResult.fulfillmentMessages, 'text.text');

const normalize = text => {
  return text
    .replace(new RegExp('’', 'g'), "'")
    .replace(new RegExp('«', 'g'), '"')
    .replace(new RegExp('»', 'g'), '"');
};

const sendSmsResponse = (messages, to, options) => {
  messages = _.flatten([messages]);
  const promises = [];
  const nexmo = createNexmoInstance(options.apiKey, options.apiSecret);
  const throttling =
    options.throttling !== undefined
      ? options.throttling
      : DEFAULT_THROTTLING_MS;

  for (let i = 0; i < messages.length; i++) {
    promises.push(
      new Promise(resolve =>
        setTimeout(() => {
          console.log(`${to} <== ${messages[i]}`);
          nexmo.message.sendSms(options.did, to, normalize(messages[i]));
          resolve();
        }, i * throttling)
      )
    );
  }

  return Promise.all(promises).then(() => {
    console.log('completed');
    return true;
  });
};
