const numbers = require("../");
const config = require("./config");
const fs = require("fs");

numbers.Client.globalOptions.apiEndPoint = config.apiEndPoint;
numbers.Client.globalOptions.accountId = config.accountId;
numbers.Client.globalOptions.userName = config.userName;
numbers.Client.globalOptions.password = config.password;

const selectedSite = config.selectedSiteId;
const selectedPeer = config.selectedSipPeerId

if(selectedSite === undefined || selectedPeer === undefined){
  console.log("You must configure a site and sip peer for this demo in your config file");
  process.exit(1);
}

if(process.argv.length < 3){
  console.log("usage: node hostedMessaging-sample.js [number] e.g. node portIn-sample 9195551212");
  process.exit(1);
}

const numberToCheck = process.argv[2];
// const numberToCheck = "3854293688";

const checkImportability = async (number) => {
  try {
    const importableResponse = await numbers.ImportTnChecker.checkAsync([number]);
    const isImportable = (importableResponse.importTnCheckerPayload.importTnErrors === 0);
    if (isImportable) {
      return {
        importable: true
      }
    }
    else {
      return {
        importable: false,
        errorMessage: importableResponse.importTnCheckerPayload.importTnErrors.importTnError
      }
    }
  }
  catch (e) {
    console.log('Error checking importability');
    console.log(e);
  }
}

const createImportTnOrder = async (importRequest, numbersToImport) => {
  try {
    const importResponse = await numbers.ImportTnOrder.createAsync(importRequest, numbersToImport);
    const importAccepted = (importResponse.errors === 0);
    if (importAccepted) {
      return {
        accepted: true,
        response: importResponse
      }
    }
    else {
      return {
        accepted: false,
        response: importResponse
      }
    }
  }
  catch (e) {
    console.log('Error creating import tn order, note that this does not mean the import order was successful, but only that the initial request failed');
    console.log(e);
  }
}

const main = async (number) => {
  const isImportable = await checkImportability(number);
  if (isImportable.importable !== true) {
    const errorCode = isImportable.errorMessage.code;
    const errorDescription = isImportable.errorMessage.description;
    console.log(`Number ${number} is not importable.\n\tCode: ${errorCode}\n\tDescription: ${errorDescription}`);
    return;
  }
  const subscriberInformation = {
    name: "ABC Inc.",
    serviceAddress: {
      houseNumber: "11235",
      streetName: "StreetName",
      stateCode: "NC",
      city: "City",
      county: "county",
      zip: "27606"
    }
  };
  const importRequest = {
    customerOrderId: "customerOrderId",
    siteId: selectedSite,
    sipPeerId: selectedPeer,
    loaAuthorizingPerson: "LoaAuthorizingPerson",
    subscriber: subscriberInformation
  };
  const importResponse = await createImportTnOrder(importRequest, [number]);
  console.log(JSON.stringify(importResponse));


}

main(numberToCheck);



