const express = require("express");
const router = express.Router();

router.use("/predictions", require("./predictions.route"));
router.use("/auth", require("./user.route"));

router.get("/health", (req, res) => {
  res.json({ message: "API v1 is working" });
});

module.exports = router;