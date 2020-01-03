var numbers = require("../");
var config = require("./config");

numbers.Client.globalOptions.apiEndPoint = config.apiEndPoint;
numbers.Client.globalOptions.accountId = config.accountId;
numbers.Client.globalOptions.userName = config.userName;
numbers.Client.globalOptions.password = config.password;

numbers.Account.get(function(err,account){
  if(err){
    console.log(err);
  }else {
    console.log("Account Details: " + JSON.stringify(account,null,2));
  }
});