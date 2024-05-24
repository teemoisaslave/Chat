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
io.on("connection", (socket) => {
  console.log("a user connected");
  console.log(socket.id);
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
    io.to(room).emit("chat message", { timestamp, username, message });
    let chat = chats.find((chat) => chat.chat === room);
    if (chat) {
      chat.messaggi.push({
        autore: username,
        ora: timestamp,
        messaggio: message,
      });
    }
  });
  socket.on("disconnect", () => {
    console.log(socket.id);
    let sql = `DELETE FROM online WHERE sid='${socket.id}'`;
    executeQuery(sql);
    console.log("user disconnected"); // undefined
  });
  socket.on("message", (data) => {});
});
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
    if (result === "") {
      res.status(401);
      res.json({ result: "Unauthorized" });
    } else {
      res.json({ result: "ok" });
    }
  });
});
app.post("/Utenti_get", (req, res) => {
  let users = `CREATE TABLE IF NOT EXISTS users(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL)`;
  executeQuery(users);
  let sql = `SELECT * 
  FROM users`;
  executeQuery(sql).then((result) => {
    res.json({ result: "ok", users: result });
  });
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
app.post("/user_get", (req, res) => {
  let sql = `CREATE TABLE IF NOT EXISTS online(
  userid varchar(255) NOT NULL,
  roomid VARCHAR(255) NOT NULL,
  sid VARCHAR(255) NOT NULL,
  PRIMARY KEY (sid))`;
  executeQuery(sql);
  sql = `SELECT * 
  FROM online`;
  executeQuery(sql).then((result) => {
    for (let i = 0; i < result.length; i++) {
      if (users.includes(result[i].sid)) {
      } else {
        users.push(result[i].sid);
      }
    }
    res.json({ result: "ok", message: result });
  });
});
app.post("/user_up", (req, res) => {
  let r = req.body.room;
  let u = req.body.username;
  let s = req.body.sid;
  let sql = `CREATE TABLE IF NOT EXISTS online(
  userid varchar(255) NOT NULL,
  roomid VARCHAR(255) NOT NULL,
  sid VARCHAR(255) NOT NULL,
  PRIMARY KEY (sid))`;
  executeQuery(sql);
  sql = `INSERT INTO online(roomid,userid,sid) VALUES ('${r}','${u}','${s}')`;
  executeQuery(sql);
});
app.post("/user_update", (req, res) => {
  let r = req.body.room;
  let u = req.body.username;
  let s = req.body.sid;
  let sql = `CREATE TABLE IF NOT EXISTS online(
  userid varchar(255) NOT NULL,
  roomid VARCHAR(255) NOT NULL,
  sid VARCHAR(255) NOT NULL,
  PRIMARY KEY (sid))`;
  executeQuery(sql);
  sql = `UPDATE online SET roomid = '${r}', sid = '${s}' WHERE userid = '${u}'`;
  executeQuery(sql);
  console.log("ciao");
});
app.post("/msng_get", (req, res) => {
  let room = req.body.room;
  let sql = `CREATE TABLE IF NOT EXISTS messages(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    message VARCHAR(255) NOT NULL,
    roomid VARCHAR(255) NOT NULL,
    userid VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    timestamp VARCHAR(255) NOT NULL)`;
  executeQuery(sql);
  sql = `SELECT * 
  FROM messages
  WHERE roomid='${room}'`;
  executeQuery(sql).then((result) => {
    res.json({ result: "ok", message: result });
  });
});

app.post("/msng_up", (req, res) => {
  let r = req.body.room;
  let m = req.body.message;
  let u = req.body.username;
  let i = req.body.images;
  let t = req.body.timestamp;
  let ty = req.body.type;
  let sql = `CREATE TABLE IF NOT EXISTS messages(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    message VARCHAR(255) NOT NULL,
    roomid VARCHAR(255) NOT NULL,
    userid VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    timestamp VARCHAR(255) NOT NULL)`;
  executeQuery(sql);
  sql = `INSERT INTO messages(message,roomid,userid,timestamp,type) VALUES ('${m}','${r}','${u}','${t}','${ty}')`;
  executeQuery(sql);
});

app.post("/ban_u", (req, res) => {
  let u = req.body.username;
  let sql = `CREATE TABLE IF NOT EXISTS banned(
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  userid VARCHAR(255) NOT NULL)`;
  executeQuery(sql);
  sql = `INSERT INTO banned(userid) VALUES ('${u}')`;
  executeQuery(sql);
});
app.post("/ban_get", (req, res) => {
  let room = req.body.room;
  let sql = `CREATE TABLE IF NOT EXISTS banned(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    userid VARCHAR(255) NOT NULL)`;
  executeQuery(sql);
  sql = `SELECT * 
  FROM banned`;
  executeQuery(sql).then((result) => {
    console.log(result);
    res.json({ result: "ok", message: result });
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
