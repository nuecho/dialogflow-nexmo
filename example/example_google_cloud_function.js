"use strict";

const dialogflowNexmo = require("dialogflow-nexmo");

const FUNCTION_NAME = process.env.FUNCTION_NAME;

const options = {
  dialogflow: {
    projectId: "YOUR_PROJECT_ID"
  },
  nexmo: {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.SECRET_KEY,
    did: process.env.DID
  }
};

exports[FUNCTION_NAME] = async (req, res) => {
  await dialogflowNexmo.connect(
    req.query.text,
    req.query.msisdn,
    options
  );

  res.status(204).send();
};
