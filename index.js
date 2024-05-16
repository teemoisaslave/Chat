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
let users = [];
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
      console.log(users);
    }
  });

  socket.on("disconnect", () => {
    for (let i = 0; i < users.length; i++) {
      console.log(socket.id, users[i]);
      if (socket.id === users[i]) {
        users.splice(i, 1);
      }
    }
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
  let user = `CREATE TABLE IF NOT EXISTS users(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL)`;
  executeQuery(user);
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
      res.json({ result: "ok", chats: chats, users: users });
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
app.post("/room_up", (req, res) => {
  let r = req.body.room;
  let sql = `CREATE TABLE IF NOT EXISTS rooms(
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  room VARCHAR(255) NOT NULL)`;
  executeQuery(sql);
  sql = `INSERT INTO rooms(room) VALUES ('${r}')`;
  executeQuery(sql);
});
app.get("/room_get", (req, res) => {
  let sql = `CREATE TABLE IF NOT EXISTS rooms(
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  room VARCHAR(255) NOT NULL)`;
  executeQuery(sql);
  sql = `SELECT * 
  FROM rooms`;
  executeQuery(sql).then((result) => {
    res.json({ result: "ok", rooms: result });
  });
});
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024, // limita la dimensione del file a 5MB
  },
  allowUploadBuffering: true, // abilita il buffering del file
});
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file; // Accedi al file caricato
    const fileName = path.basename(file.originalname); // Estrai solo il nome del file
    const link = await megaFunction.uploadFileToStorage(fileName, file.buffer); // Carica il file su Mega
    console.log("File caricato con successo. Path: ", fileName);
    res.status(200).json({ Result: fileName, link: link }); // Restituisci solo il nome del file e il link
  } catch (error) {
    console.error(error);
    res.status(500).send("Errore del server");
  }
});
app.post("/download", async (req, res) => {
  const link = req.body.mega;
  const name = req.body.name;
  try {
    const { stream, fileName } = await megaFunction.downloadFileFromLink(link); // Scarica il file da Mega
    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    stream.pipe(res); // Invia il flusso di dati al client
  } catch (error) {
    console.error(error);
    res.status(500).send("Errore del server");
  }
});
