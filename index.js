const fs = require("fs");
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const confi = require("./config.js");
const connection = mysql.createConnection(confi);
const { Server } = require("socket.io");
const conf = JSON.parse(fs.readFileSync("./conf.json"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(express.static("public"));
const server = http.createServer(app);

const io = new Server(server);
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
  let sql = executeQuery(sql);
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
  let username = req.body.username;
  let date = new Date().toLocaleString();
  console.log("socket connected: " + req.body.username);
  io.emit("chat", date + ".. " + "new client: " + req.body.username);
  res.send("ok");
});
app.post("/new_m", (req, res) => {
  let message = req.body.message;
  let user = req.body.username;
  let date = new Date().toLocaleString();
  console.log("message: " + message);
  io.emit("chat", date + ".. " + user + ".. " + message);
  res.send("ok");
});

//mega da sistemare



server.listen(conf.port, () => {
  console.log("server running on port: " + conf.port);
});
