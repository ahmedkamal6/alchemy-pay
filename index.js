const express = require("express");
const sha1 = require("js-sha1");
const app = express();
app.use(express.json());
const APP_ID = "f83Is2y7L425rxl8"
const APP_SECRET = "4Yn8RkxDXN71Q3p0"


app.post("/webhook", (req, res) => {
  // Verify the signature for authentication
  const receivedTimestamp = Date.now();
  const appId = APP_ID;
  const appSecret = APP_SECRET;
  const signature = sha1(appId + appSecret + String(receivedTimestamp))
  if (signature !== req.get("sign")) {
    console.error("Invalid signature");
    return res.status(400).json({success: false,returnCode: "9999",returnMsg: "Invalid signature"});
  }

  else{
    //transfer crypto to user address according to crypto amount
    const {orderNo,crypto,network,address,cryptoAmount,cryptoPrice,usdtAmount} = req.body;
    res.status(200).json({ success: true, returnCode: '0000', returnMsg: 'Notification received' });
  }
});

app.get("/price",(req,res)=>{
  // Verify the signature for authentication
    const receivedTimestamp = Date.now();
    const appId = APP_ID;
    const appSecret = APP_SECRET;
    const signature = sha1(appId + appSecret + String(receivedTimestamp))
    console.log(signature)
    console.log(req.get("sign"))
    if (signature !== req.get("sign")) {
      console.log("Invalid signature");
      return res.status(400).json({success: false,returnCode: "9999",returnMsg: "Invalid signature"});
    }
    else {
      const {crypto} = req.body
      res.status(200).json({ success: true, returnCode: '0000', returnMsg: 'Price sent',data: {
        price: 454.4658,//usdt
        networkList: [
            {
                network: "ONQ",
                networkFee: 4.659 //usdt
            },
            {
                network: "YIIW",
                networkFee: 6.82733
            }
        ]
      }, 
    });
  }
})

app.listen(5000, () => {
  console.log("Webhook listening on port 3000");
});
