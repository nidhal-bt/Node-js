// Dependencies
var http = require("http");
var https = require("https");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
// to show an object inside terminal log
var util = require("util");
var config = require("./lib/config");
var fs = require("fs");
var handlers = require("./lib/handlers");
var helpers = require("./lib/helpers");

helpers.sendTwilioSms("4158375309", "Hello!", function(err) {
console.log('error with twilio', err)
})

// for testing
// var _data = require("./lib/data");
// _data.create("test", "test", { foo: "hellooo" }, function (data) {
//   console.log("data", data);
// });

// the server should respond to all requests with a string
// Instantiate the HTTP server
var httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res);
});

// Start the server, and have it listen on port 3001
httpServer.listen(config.httpPort, function () {
  console.log(
    "the server is listening on httpPort " +
      config.httpPort +
      " in " +
      config.envName +
      " environment now"
  );
});

// // Instantiate the HTTPS server
// var httpsServerOption = {
//   key: fs.readFileSync("./https/key.pem"),
//   cert: fs.readFileSync("./https/cert.pem"),
// };
// var httpsServer = https.createServer(httpsServerOption, function (req, res) {
//   unifiedServer(req, res);
// });

// // Start the server, and have it listen on port 3001
// httpsServer.listen(config.httpsPort, function () {
//   console.log(
//     "the server is listening on httpsPort " +
//       config.httpsPort +
//       " in " +
//       config.envName +
//       " environment now"
//   );
// });

// All the server logic

var unifiedServer = function (req, res) {
  // Get the url and parse it
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP method
  var method = req.method.toLowerCase();

  // Get the feaders as an object
  var headers = req.headers;

  // Get the payload, if any
  var decoder = new StringDecoder("utf-8");
  var buffer = "";
  req.on("data", function (data) {
    buffer += decoder.write(data);
  });

  req.on("end", function () {
    buffer += decoder.end();

    // Choose the handler this request should go to, If one is not found, use the notFound handler
    var chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to the handler
    var data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    chosenHandler(data, function (statusCode, payload) {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode === "number" ? statusCode : 200;
      // Use the payload called back by the handler, or default to an empty object
      payload = typeof payload === "object" ? payload : {};

      // Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      var logBody = {
        path: trimmedPath,
        method,
        queryStringObject,
        headers,
        buffer,
        statusCode,
        payloadString,
      };

      console.log(
        "Request received" +
          util.inspect(logBody, {
            showHidden: false,
            depth: null,
            colors: true,
          })
      );
    });
  });
};

// Define a request router
var router = {
  sample: handlers.sample,
  users: handlers.users,
  ping: handlers.ping,
  tokens: handlers.tokens,
  checks: handlers.checks
};
