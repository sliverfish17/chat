import { WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";
import { writeFile, readFileSync, existsSync } from "fs";

const clients = {};
const log = existsSync("db") && readFileSync("db", "utf-8");
const messages = log ? JSON.parse(log) : [];

const wss = new WebSocketServer({ port: 8000 });
wss.on("connection", (ws) => {
  const id = uuid();
  clients[id] = ws;
  ws.send(JSON.stringify(messages));

  ws.on("message", (rawMessage) => {
    const { name, message } = JSON.parse(rawMessage);
    messages.push({ name, message });
    for (const id in clients) {
      clients[id].send(JSON.stringify([{ name, message }]));
    }
  });

  ws.on("close", () => {
    delete clients[id];
  });
});

// Saving the message log so it won't dissapear when server starts

process.on("SIGINT", () => {
  console.log("Shutting down");
  wss.close();
  writeFile("db", JSON.stringify(messages), (err) => {
    if (err) {
      console.log(err);
    }
    process.exit();
  });
});
