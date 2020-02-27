const numbers = require("@bandwidth/numbers");

//Using client directly
const client = new numbers.Client(process.env.BANDWIDTH_ACCOUNT_ID,
                                  process.env.BANDWIDTH_API_USER,
                                  process.env.BANDWIDTH_API_PASSWORD);


const findAndDeleteSubscriptionById = async (id) => {
  try {
    const subscriptions = await numbers.Subscription.listAsync(client, {});
    for (const s of subscriptions) {
      console.log(s.id);
      // 6be53e36-...-668ee3603d71
      // b57094d3-...-25085d224b48
      if (s.id === id) {
        const deletedS = await s.deleteAsync();
        console.log(deletedS);
        // {}
      }
    }
    const moreSubscriptions = await numbers.Subscription.listAsync(client, {});
    console.log(moreSubscriptions)
    // [
    //   Subscription {
    //     subscriptionId: '6be53e36-...-668ee3603d71',
    //     orderType: 'portins',
    //     emailSubscription: { email: '...@bandwidth.com', digestRequested: 'NONE' },
    //     client: Client {
    //       prepareRequest: [Function],
    //       concatAccountPath: [Function],
    //       prepareUrl: [Function],
    //       xml2jsParserOptions: [Object]
    //     },
    //     id: '6be53e36-...-668ee3603d71'
    //   }
    // ]
  }
  catch (e) {
    console.log('Error');
    console.log(e);
  }
}

findAndDeleteSubscriptionById('b57094d3-...-25085d224b48');
