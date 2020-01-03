var numbers = require("../");
var config = require("./config");

numbers.Client.globalOptions.apiEndPoint = config.apiEndPoint;
numbers.Client.globalOptions.accountId = config.accountId;
numbers.Client.globalOptions.userName = config.userName;
numbers.Client.globalOptions.password = config.password;

if(process.argv.length < 4){
  console.log("usage: node availableNpaNxx-search-sample [areaCode] [qty] e.g. node availableNpaNxx-search-sample 919 3");
  process.exit(1);
}

var areaCode = process.argv[2];
var quantity = process.argv[3];

numbers.AvailableNpaNxx.list({areaCode:areaCode, quantity:quantity}, function(err, res){
  if(err){
    console.log(err);
  } else {
    console.log("Available NpaNxx: " + JSON.stringify(res,null, 2));
  }
});