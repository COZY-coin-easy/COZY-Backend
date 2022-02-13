const WebSocket = require("ws");
const wsModule = require("ws");

module.exports = (server) => {
  const clientWss = new WebSocket.Server({ server });
  const bithumbWs = new wsModule(process.env.BITHUMB_SOCKET_URL);
  let coinInfo = null;

  const requestData = {
    type: "ticker",
    symbols: ["BTC_KRW", "ETH_KRW"],
    tickTypes: ["24H"],
  };
  const subscribeData = JSON.stringify(requestData);

  bithumbWs.onopen = (ws) => {
    bithumbWs.send(subscribeData);
  };

  bithumbWs.onmessage = (event) => {
    coinInfo = event.data;
    console.log("빗썸의 답::", coinInfo);
  };

  clientWss.on("connection", (ws) => {
    ws.on("message", (message) => {
      console.log("클라이언트에서 보내온 메세지:::", message.toString("utf8"));
    });

    ws.on("error", (error) => {
      console.error(error);
    });

    ws.interval = () => {
      setTimeout(() => {
        try {
          ws.send(coinInfo);
        } catch (error) {
          console.error(error);
        }

        ws.interval();
      }, 2000);
    };

    ws.interval();
  });
};
