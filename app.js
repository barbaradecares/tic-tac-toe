const express = require("express");
const http = require("http");

const router = require("./router/routes");

const app = express();

router(app);

const server = http.createServer(app);

server.listen(process.env.PORT || 5000);
console.log(`NodeJS Server running on port ${port}.`);
