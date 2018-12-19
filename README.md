# dialogflow-nexmo

> A bridge between the [Nexmo](https://nexmo.com) Messaging API and [Google Dialogflow](https://dialogflow.com/).

## How it works

This middleware relies on both [Nexmo](https://www.npmjs.com/package/nexmo) and [Dialogflow](https://www.npmjs.com/package/dialogflow) SDKs. Inbound text messages sent to provisioned Nexmo number are handled through a webhook which forwards it to Dialogflow API.

Responses from Dialogflow go through a text normalization phase to remove unsupported characters and are sent back to the origination number. Multiple response messages are throttled to minimize delivery error rate.

## Getting Started

### Requirements

#### Nexmo

Nexmo integration requires a Nexmo account with a [provisioned SMS DID/Number](https://dashboard.nexmo.com/your-numbers). You also need to configure the webhook endpoint from your Nexmo account. Please refer to the Nexmo documentation for more information.

#### Dialogflow

Dialogflow integration requires a Dialogflow (and/or Google Cloud Platform) account along with a project Id (mapping to
an actual Dialogflow project).

### Usage

Require the dialogflowNexmo middleware. Then simply call the `dialogflowNexmo.connect(message, origination, options)` function, where

- `message` is either a string or an array of strings containing the user input;
- `origination` is the phone number used to call the service;
- and `options` is an object holding all the Dialogflow and Nexmo configuration (see next section for more information on that subject).

The function returns a Promise.

#### Configuration

This is a list of the configurations expected by the middleware. Keys with a default value are optional.

| Key                     | Description                                                           | Default |
| ----------------------- | --------------------------------------------------------------------- | ------- |
| dialogflow.projectId    | Dialogflow Project Id                                                 | -       |
| dialogflow.languageCode | Dialogflow Project Language                                           | en-US   |
| dialogflow.env          | Dialogflow Project Environment. When specified, will use the Beta API | -       |
| nexmo.apiKey            | Nexmo API Key                                                         | -       |
| nexmo.apiSecret         | Nexmo API Secret                                                      | -       |
| nexmo.did               | Nexmo Number                                                          | -       |
| nexmo.throttling        | Nexmo message throttling in ms.                                       | 500     |

### Integration

Please consult the files in the [example]('example/') folder for integration examples.

Note: for the moment, we only support deploying on a Google Cloud Function in the same account as your Dialogflow account. We plan on supporting a wider range of options in the close future.

## Test

    yarn install
    yarn run test --silent

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/nuecho/dialogflow-nexmo/tags).

## Support

You can reach the dialogflow-nexmo team by email at iva-solutions-support@nuecho.com

## License

This project is licensed under the Apache License, Version 2.0 - see the [LICENSE]('LICENCE') file for details
