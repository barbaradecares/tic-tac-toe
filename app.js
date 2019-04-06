const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");

const router = require("./router/routes");

const app = express();
app.use(bodyParser.json());
app.use(cors());

router(app);

const server = http.createServer(app);

server.listen(process.env.PORT || 5000);
