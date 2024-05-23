import { createRequire } from "module";
export { confDB };
const require = createRequire(import.meta.url);
const fs = require("fs");
const confDB = {
  host: "mysql-3be64f8f-itis-f13b.a.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_DKMQmbVZLAsywRIgNFi",
  database: "chat",
  port: 28516,
  ssl: {
    ca: fs.readFileSync("ca.pem"),
    rejectUnauthorized: true,
  },
};