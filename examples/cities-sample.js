var numbers = require("../");
var config = require("./config");

numbers.Client.globalOptions.apiEndPoint = config.apiEndPoint;
numbers.Client.globalOptions.accountId = config.accountId;
numbers.Client.globalOptions.userName = config.userName;
numbers.Client.globalOptions.password = config.password;

if(process.argv.length < 3){
  console.log("usage: node cities-sample [stateAbbreviation] e.g. node cities-sample NC");
  process.exit(1);
}

var state = process.argv[2];
numbers.City.list({"available":true, "state":state}, function(err,list){
  console.log("Cities for selected state: " + JSON.stringify(list, null, 2));
});