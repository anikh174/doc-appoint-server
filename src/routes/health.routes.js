const { Router } = require("express");
const { success } = require("../utils/api-response");

const router = Router();

router.get("/", (req, res) => {
  return success(res, { status: "ok", uptime: process.uptime() });
});

module.exports = router;
