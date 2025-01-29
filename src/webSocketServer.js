import WebSocket, { WebSocketServer } from "ws";

const SOCKET_PORT = process.env.SOCKET_PORT || 8001;
export const ws = new WebSocketServer({ port: SOCKET_PORT });

ws.on("connection", (client) => {
  client.on("message", (message) => {
    console.log(
      "--Socket:Client:Message Received-----",
      (message || "").toString()
    );
  });
});

ws.on("message", (message) => {
  console.log("--Socket:Group:Message Received-----", message);
});

ws.on("cart", (arg) => {
  ws.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(arg));
    }
  });
});
