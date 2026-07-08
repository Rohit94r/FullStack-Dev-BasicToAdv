const express = require("express");
const router = express.Router();
const { loansController } = require("../controllers/loans.controller");

router.post("/borrow", loansController.borrow);
router.post("/:id/return", loansController.returnBook);
router.get("/stats", loansController.stats);

module.exports = router;
