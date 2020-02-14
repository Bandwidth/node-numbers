var Client = require("./client");
var IMPORT_TN_CHECKER_PATH = "importTnChecker";

module.exports = {
  check: function(client, numbers, callback){
    if(arguments.length === 2){
      callback = numbers;
      numbers = client;
      client = new Client();
    }
    var data = {
      importTnCheckerPayload:{
        telephoneNumbers: {
          telephoneNumber:numbers
        }
      }
    };
    client.makeRequest("post", client.concatAccountPath(IMPORT_TN_CHECKER_PATH), data, callback);
  }
};
