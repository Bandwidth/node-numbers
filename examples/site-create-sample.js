var numbers = require("../");
var config = require("./config");

numbers.Client.globalOptions.apiEndPoint = config.apiEndPoint;
numbers.Client.globalOptions.accountId = config.accountId;
numbers.Client.globalOptions.userName = config.userName;
numbers.Client.globalOptions.password = config.password;

var site = {
  name:"My First Site",
  description:"A Site From Node SDK Examples",
  address:{
    houseNumber: "123",
    streetName: "Anywhere St",
    city: "Raleigh",
    stateCode:"NC",
    zip: "27609",
    addressType: "Service"
  }
};

numbers.Site.create(site, function(err,site){
  if(err){
    console.log("error: " + err);
  }else {
    console.log("Site successfully created" );
    console.log(JSON.stringify(site,null,2));
    var updates = {name:"An Updated Site"};
    site.name = "Updated Site";
    site.update(site,function(err, res){
      if(err){
        console.log("Error updating site: " + err)
      }else {
        numbers.Site.get(site.id, function(err, updatedSite){
          if(err){
            console.log("Error getting site: " + err);
          }else {
            console.log("Updated site: " + JSON.stringify(updatedSite, null, 2));
          }
        })
      }
    });
  }
});