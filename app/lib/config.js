/* Create and export configuration variables
 */

/* Container for all the environment
 */

var environment = {};

// Staging variables
environment.staging = {
  httpPort: 3001,
  httpsPort: 3002,
  envName: "staging",
  hashingSecret: "thisIsASecret",
  maxChecks: 5,
  twilio: {
    accountSid: "",
    authToken: "",
    fromPhone: "+15005550006",
  },
};

//Production environment

environment.production = {
  httpPort: 4001,
  httpsPort: 4002,
  envName: "production",
  hashingSecret: "thisIsAlsoASecret",
  maxChecks: 5,
  twilio: {
    accountSid: "",
    authToken: "",
    fromPhone: "+15005550006",
  },
};

// Determine which environment was passed as a command-line argument
var currentEnvironment =
  typeof process.env.NODE_ENV === "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

// Check that the current environment is one of the environment above, if not, default to staging
var environemntToExport =
  typeof environment[currentEnvironment] === "object"
    ? environment[currentEnvironment]
    : environment.staging;

// Export the module
module.exports = environemntToExport;
