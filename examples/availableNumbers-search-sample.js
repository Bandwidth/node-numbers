var numbers = require("../");
var config = require("./config");

numbers.Client.globalOptions.apiEndPoint = config.apiEndPoint;
numbers.Client.globalOptions.accountId = config.accountId;
numbers.Client.globalOptions.userName = config.userName;
numbers.Client.globalOptions.password = config.password;

if(process.argv.length < 4){
  console.log("usage: node availableNumbers [state] [qty] e.g. node availableNumbers 919 3");
  process.exit(1);
}

var state = process.argv[2];
var quantity = process.argv[3];

numbers.AvailableNumbers.list({state:state, quantity:quantity}, function(err, res){
  if(err){
    console.log(err);
  } else {
    console.log("Available TNs: " + JSON.stringify(res,null, 2));
  }
});