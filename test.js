const APP_ID = "f83Is2y7L425rxl8";
const APP_SECRET = "4Yn8RkxDXN71Q3p0";
const sha1 = require("js-sha1");
const axios = require("axios");
const { response } = require("express");

const testPrice = () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://localhost:5000/price",
    headers: {
      appId: APP_ID,
      timestamp: Date.now(),
      sign: sha1(APP_ID + APP_SECRET + String(Date.now())),
    },
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      console.log(response.data);
      
    })
    .catch((error) => {
      console.log(error.response.data);
    });
};

const testWebHook = () => {
  const config = {
    method: "post",
    url: "http://localhost:5000/webhook",
    headers: {
      appId: APP_ID,
      timestamp: Date.now(),
      sign: sha1(APP_ID + APP_SECRET + Date.now()),
    },
    data: {
      orderNo: "12345",
      crypto: "BTC",
      cryptoAmount: "0.01",
      cryptoPrice: "60000",
      txHash: "0x123abc",
      network: "BTC",
      address: "123abc",
    },
  };
  axios
    .request(config)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
};

const testCallback = () => {
    const config = {
      method: "post",
      url: "http://localhost:5000/alchemyOnRamp/callback",
      data: {
        appId: APP_ID,
        orderNo: "ORDER123",
        email: "test@test.com",
        crypto: "BTC",
        cryptoPrice: "60000",
        cryptoQuantity: "0.01",
        payType: "credit_card",
        fiat: "USD",
        amount: "100",
        payTime: "2022-04-04 14:30:00",
        network: "BTC",
        address: "123abc",
        txTime: "2022-04-04 14:45:00",
        txHash: "0x123abc",
        status: "PAY_SUCCESS",
        message: "Payment successful",
        merchantOrderNo: "MERCHANT_ORDER123",
        networkFee: "0.0005",
        rampFee: "0.02",
        signature: sha1(APP_ID + APP_SECRET + String("ORDER123" + "BTC" + "BTC" + "123abc")),
      },
    };
  
    axios(config)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
  };

 
  module.exports = {testCallback,testPrice,testWebHook}