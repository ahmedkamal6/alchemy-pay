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
    })
    .catch((error) => {
      console.log("error");
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
      console.log(error);
    });
};
