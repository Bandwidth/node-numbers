var numbers = require("../");
var config = require("./config");

numbers.Client.globalOptions.apiEndPoint = config.apiEndPoint;
numbers.Client.globalOptions.accountId = config.accountId;
numbers.Client.globalOptions.userName = config.userName;
numbers.Client.globalOptions.password = config.password;

if(process.argv.length < 3){
  console.log("usage: node tns-details-sample [number] e.g. node tns-details-sample 9195551212");
  process.exit(1);
}

var tn = process.argv[2];
numbers.Tn.get(tn, function(err,item){
  if(err){
    console.log(err);
  }
  console.log("TN Details: " + JSON.stringify(item, null, 2));
});