const express = require("express");
const sha1 = require("js-sha1");
const axios = require("axios");
const {testPrice,testWebHook,testCallback} = require('./test') 

const app = express();
app.use(express.json());
const APP_ID = "f83Is2y7L425rxl8";
const APP_SECRET = "4Yn8RkxDXN71Q3p0";




function verifySignature(req, res, next) {
  const SIGNATURE_VALIDITY_PERIOD = 5 * 60 * 1000;
  const receivedTimestamp = Date.now();
  const appId = req.get("appId");
  const appSecret = APP_SECRET;
  const requestTimestamp = parseInt(req.get("timestamp"), 10);
  const signatureAge = receivedTimestamp - requestTimestamp;
  const signature = sha1(appId + appSecret + String(requestTimestamp));

  if (
    signature !== req.get("sign") ||
    signatureAge > SIGNATURE_VALIDITY_PERIOD
  ) {
    console.log("Invalid signature");
    return res.status(400).json({
      success: false,
      returnCode: "9999",
      returnMsg: "Invalid signature",
    });
  } else {
    next();
  }
}

//this webhook to listen for Alchemy Pay notification that the user has paid and we need to transfer the tokens
app.post("/webhook",verifySignature, (req, res) => {
  // Verify the signature for authentication
    const {
      orderNo,
      crypto,
      network,
      address,
      cryptoAmount,
      cryptoPrice,
      usdtAmount,
    } = req.body;
    //transfer crypto to user address according to crypto amount
    //.....
    //notify alchemy pay that tokens are transferred
    const transactionData = {
      orderNo: "12345",
      crypto: "BTC",
      cryptoAmount: "0.01",
      cryptoPrice: "60000",
      txHash: "0x123abc",
      network: "BTC",
      address: "123abc",
    };
    try {
      const timestamp = Date.now();
      axios
        .post("https://openapi-test.alchemypay.org", transactionData, {
          headers: {
            appId: APP_ID,
            timestamp,
            sign: sha1(APP_ID + APP_SECRET + String(timestamp)),
          },
        })
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log("error");
        });
    } catch (error) {
      console.log(error);
      res.status(400).json({ success: false, error });
    }
    res.status(200).json({
      success: true,
      returnCode: "0000",
      returnMsg: "Notification sent to alchemy pay",
    });
  }
);
//this endpoint sends the price of the currency to Alchemy Pay 
app.get("/price",verifySignature, (req, res) => {
  // Verify the signature for authentication
    const { crypto } = req.body;
    res.status(200).json({
      success: true,
      returnCode: "0000",
      returnMsg: "Price sent",
      data: {
        price: 454.4658, //usdt
        networkList: [
          {
            network: "ONQ",
            networkFee: 4.659, //usdt
          },
          {
            network: "YIIW",
            networkFee: 6.82733,
          },
        ],
      },
    });
  }
);
//this is the end point that Alchemy Pay will use when transaction complete and send all the information which then will be added to our db
app.post("/alchemyOnRamp/callback", (req, res) => {

  const { appId, signature, ...transactionData } = req.body;
  const appSecret = APP_SECRET;
  const sign = sha1(
      appId +
      appSecret +
      String(
          transactionData.orderNo +
          transactionData.crypto +
          transactionData.network +
          transactionData.address
      )
  );

  if (signature !== sign) {
    console.log("Invalid signature");
    return res.status(400).json({
      success: false,
      returnCode: "9999",
      returnMsg: "Invalid signature",
    });
  }
  console.log(transactionData)
  //alchemyTransactions.createTransaction(transactionData);
});

app.listen(5000, () => {
  console.log("Webhook listening on port 3000");
});

//testPrice()
testWebHook()
//testCallback()
