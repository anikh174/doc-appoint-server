const { Router } = require("express");
const { asyncHandler } = require("../middleware/async-handler");
const { verifyToken } = require("../middleware/verify-token");
const { listDoctors, getDoctor } = require("../controllers/doctor.controller");

const router = Router();

router.get("/", asyncHandler(listDoctors));
router.get("/:id", verifyToken, asyncHandler(getDoctor));

module.exports = router;
