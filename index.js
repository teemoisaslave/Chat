const express = require("express");
const fs = require("fs");
const http = require("http");
const path = require("path");
const app = express();
const mysql = require("mysql2");
const conf = require("./config.js");
const connection = mysql.createConnection(conf);
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(express.static("public"));
//app.use("/", express.static(path.join(__dirname, "public")));
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

const server = http.createServer(app);
server.listen(80, () => {
  console.log("--server running");
});
