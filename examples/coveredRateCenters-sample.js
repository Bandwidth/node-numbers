var numbers = require("../");
var config = require("./config");

numbers.Client.globalOptions.apiEndPoint = config.apiEndPoint;
numbers.Client.globalOptions.accountId = config.accountId;
numbers.Client.globalOptions.userName = config.userName;
numbers.Client.globalOptions.password = config.password;

if(process.argv.length < 3){
  console.log("usage: node coveredRateCenters [zip] e.g. node rateCenters 27609");
  process.exit(1);
}

var zip = process.argv[2];
numbers.CoveredRateCenter.list({"zip":zip}, function(err,list){
  console.log("First in list: " + JSON.stringify(list, null, 2));
});