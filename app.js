const express = require("express");
const http = require("http");

const router = require("./router/routes");

const app = express();

router(app);

const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port);
console.log(`NodeJS Server running on port ${port}.`);
