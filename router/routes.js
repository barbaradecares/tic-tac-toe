const boardController = require("../controllers/boardController");

module.exports = app => {
  app.get("/", boardController.index);
};
