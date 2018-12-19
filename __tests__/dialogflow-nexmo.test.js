const _ = require('lodash');
const dialogflow = require('dialogflow');
const dialogflowNexmo = require('../src/dialogflow-nexmo');

describe('dialogflow-nexmo', () => {
  const DIALOGFLOW_OPTIONS = {
    projectId: 'projectId'
  };

  const NEXMO_OPTIONS = {
    apiKey: 'apiKey',
    apiSecret: 'apiSecret',
    did: 'did'
  };

  const NO_OPTIONS = {};

  it('should work with all correct options', async () => {
    const status = await dialogflowNexmo.connect(
      'query',
      'origination',
      buildOptions(DIALOGFLOW_OPTIONS, NEXMO_OPTIONS)
    );
    expect(status).toBeTruthy();
  });

  it('should throw with no dialogflow options', async () => {
    expect(
      dialogflowNexmo.connect(
        'query',
        'origination',
        buildOptions(NO_OPTIONS, NEXMO_OPTIONS)
      )
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw with any missing dialogflow required options', () => {
    const missingField = _.first(dialogflowNexmo.DIALOGFLOW_REQUIRED_FIELDS);
    const incompleteDialogflowOptions = _.omit(DIALOGFLOW_OPTIONS, [
      missingField
    ]);

    expect(
      dialogflowNexmo.connect(
        'query',
        'origination',
        buildOptions(incompleteDialogflowOptions, NEXMO_OPTIONS)
      )
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw with no nexmo options', async () => {
    expect(
      dialogflowNexmo.connect(
        'query',
        'origination',
        buildOptions(DIALOGFLOW_OPTIONS, NO_OPTIONS)
      )
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw with any missing nexmo required options', async () => {
    const missingField = _.first(dialogflowNexmo.NEXMO_REQUIRED_FIELDS);
    const incompleteNexmoOptions = _.omit(NEXMO_OPTIONS, [missingField]);

    expect(
      dialogflowNexmo.connect(
        'query',
        'origination',
        buildOptions(DIALOGFLOW_OPTIONS, incompleteNexmoOptions)
      )
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should use the normal api when not given the env option', async () => {
    const v2 = jest.spyOn(
      dialogflow.v2.SessionsClient.prototype,
      'sessionPath'
    );
    await dialogflowNexmo.connect(
      'query',
      'origination',
      buildOptions(DIALOGFLOW_OPTIONS, NEXMO_OPTIONS)
    );
    expect(v2).toHaveBeenCalled();
  });

  it('should use the beta api when given the env option', async () => {
    const v2beta1 = jest.spyOn(
      dialogflow.v2beta1.SessionsClient.prototype,
      'environmentSessionPath'
    );
    const dialogflowOptionsWithEnv = {
      ...DIALOGFLOW_OPTIONS,
      ...{ env: 'env' }
    };
    await dialogflowNexmo.connect(
      'query',
      'origination',
      buildOptions(dialogflowOptionsWithEnv, NEXMO_OPTIONS)
    );
    expect(v2beta1).toHaveBeenCalled();
  });
});

///////////////////////////////
//
//      Helper functions
//
///////////////////////////////

const buildOptions = (dialogflowOptions, nexmoOptions) => {
  return {
    dialogflow: dialogflowOptions,
    nexmo: nexmoOptions
  };
};
