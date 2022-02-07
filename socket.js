const WebSocket = require("ws");
const axios = require("axios");

module.exports = (server) => {
  const clientWss = new WebSocket.Server({ server });
  let coinInfo = null;

  function getApi() {
    const myCoin = "ALL";

    const tick = () => {
      setTimeout(async () => {
        try {
          const response = await axios.get(
            `https://api.bithumb.com/public/ticker/${myCoin}`
          );
          if (response.status === 200) {
            coinInfo = response.data;
          }
        } catch (error) {
          console.error(error);
        }

        tick();
      }, 1000);
    };
    tick();
  }

  getApi();

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
          ws.send(JSON.stringify(coinInfo));
        } catch (error) {
          console.error(error);
        }

        ws.interval();
      }, 3000);
    };

    ws.interval();
  });
};
