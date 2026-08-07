const { Router } = require("express");
const { asyncHandler } = require("../middleware/async-handler");
const { verifyToken } = require("../middleware/verify-token");
const {
  createBooking,
  listBookings,
  updateBooking,
  deleteBooking,
} = require("../controllers/booking.controller");

const router = Router();

router.get("/", asyncHandler(listBookings));
router.post("/", verifyToken, asyncHandler(createBooking));
router.patch("/:id", verifyToken, asyncHandler(updateBooking));
router.delete("/:id", verifyToken, asyncHandler(deleteBooking));

module.exports = router;
