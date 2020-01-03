var numbers = require("../");
var config = require("./config");

numbers.Client.globalOptions.apiEndPoint = config.apiEndPoint;
numbers.Client.globalOptions.accountId = config.accountId;
numbers.Client.globalOptions.userName = config.userName;
numbers.Client.globalOptions.password = config.password;

if(process.argv.length < 3){
  console.log("usage: node rateCenters-sample [stateAbbreviation] e.g. node rateCenters-sample NC");
  process.exit(1);
}

var state = process.argv[2];
numbers.RateCenter.list({"available":true, "state":state}, function(err,list){
  console.log("Rate Center List: ");
  console.log(JSON.stringify(list, null, 2));
});