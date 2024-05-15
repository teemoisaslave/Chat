const require = createRequire(import.meta.url);
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const bodyParser = require("body-parser");
let chats = [];
const { Storage } = require("megajs");
const { File } = require("megajs");
const url = require("url");
const fs = require("fs");
const mysql = require("mysql2");
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { confDB } from "./config.js";
import { megaFunction } from "./server/mega.js";
import multer from "multer";
import { SocketAddress } from "net";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//DB connection
const { exec } = require("child_process");
const connection = mysql.createConnection(confDB);

app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(express.static("public"));
server.listen(80, () => {
  console.log("Server listening on port 80");
});
io.on("connection", (socket) => {
  console.log("a user connected");

  // Unisciti a una room specifica
  socket.on("join room", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
    // Se la chat non esiste ancora, la creiamo
    if (!chats.find((chat) => chat.chat === room)) {
      chats.push({ chat: room, messaggi: [] });
    }
  });

  // Ascolta i messaggi di chat e li trasmette a tutti nella stessa room
  socket.on("chat message", (room, { username, message, timestamp }) => {
    io.to(room).emit("chat message", { username, message, timestamp }); // Trasmetti l'username e il messaggio
    let chat = chats.find((chat) => chat.chat === room);
    if (chat) {
      chat.messaggi.push({
        autore: username,
        ora: timestamp,
        messaggio: message,
      });
    }

    console.log(chats);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("message", (data) => {});
});
const executeQuery = (sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, function (err, result) {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(result);
    });
  });
};
const checkLogin = (us, pw, t) => {
  return new Promise((resolve, reject) => {
    if (t === "a") {
      let sql = executeQuery(
        `SELECT * 
      FROM adms 
      WHERE username = '${us}' AND password = '${pw}'`,
      ).then((sql) => {
        if (sql.length === 1) {
          resolve(sql[0]);
        } else {
          resolve("");
        }
      });
    } else if (t === "u") {
      let sql = executeQuery(
        `SELECT * 
      FROM users
      WHERE username = '${us}' AND password = '${pw}'`,
      ).then((sql) => {
        if (sql.length === 1) {
          resolve(sql[0]);
        } else {
          resolve("");
        }
      });
    }
  });
};
app.post("/login_u", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let users = `CREATE TABLE IF NOT EXISTS users(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL)`;
  executeQuery(users);
  let admins = `CREATE TABLE IF NOT EXISTS adms(
      id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL)`;
  executeQuery(admins);
  checkLogin(username, password, "u").then((result) => {
    console.log(result, "ciao");
    if (result === "") {
      res.status(401);
      res.json({ result: "Unauthorized" });
    } else {
      res.json({ result: "ok" });
    }
  });
});
app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let users = `CREATE TABLE IF NOT EXISTS users(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL)`;
  executeQuery(users);
  let admins = `CREATE TABLE IF NOT EXISTS adms(
      id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL)`;
  executeQuery(admins);
  checkLogin(username, password, "a").then((result) => {
    console.log(result);
    if (result === "") {
      res.status(401);
      res.json({ result: "Unauthorized" });
    } else {
      res.json({ result: "ok" });
    }
  });
});
app.post("/new_c", (req, res) => {
  let date = new Date().toLocaleString();
  console.log("socket connected: " + req.body.username);
  io.emit("chat", "new client: " + req.body.username + "\n" + date);
  res.send("ok");
});
app.post("/new_m", (req, res) => {
  let message = req.body.message;
  let user = req.body.username;
  let date = new Date().toLocaleString();
  console.log("message: " + message);
  io.emit("chat", req.body.username + ":" + "\n" + message + "\n" + date);
  res.send("ok");
});
app.post("/Regis_u", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let users = `CREATE TABLE IF NOT EXISTS users(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL)`;
  executeQuery(users);
  let admins = `CREATE TABLE IF NOT EXISTS adms(
      id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL)`;
  executeQuery(admins);
  let sql = `INSERT INTO users(username, password) VALUES ('${username}', '${password}')`;
  executeQuery(sql).then((result) => {
    res.json({ result: "ok" });
  });
});
