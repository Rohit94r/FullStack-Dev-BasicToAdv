const express = require("express");
const router = express.Router();
const { authorsController } = require("../controllers/authors.controller");

router.get("/", authorsController.getAll);
router.get("/:id", authorsController.getOne);
router.post("/", authorsController.create);
router.patch("/:id", authorsController.update);
router.delete("/:id", authorsController.remove);

module.exports = router;
