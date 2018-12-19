const sendSms = (from, to, message) => {
  return { from: from, to: to, message: message };
};

module.exports = class Nexmo {
  constructor(credentials) {
    this.apiKey = credentials.apiKey;
    this.apiSecret = credentials.apiSecret;
    this.message = { sendSms: sendSms };
  }
};
