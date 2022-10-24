const echo = async (app) => {
  app.get("/", { websocket: true }, (con, req) => {
    con.socket.send("Hello from server!");
    con.socket.onmessage = (event) => {
      console.log(event.data);
    };
  });
};
export {
  echo as default
};
