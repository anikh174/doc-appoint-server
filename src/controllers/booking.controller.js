const { collections } = require("../db");
const { success } = require("../utils/api-response");
const { AppError } = require("../utils/app-error");
const { toObjectId } = require("../utils/validate-object-id");

async function createBooking(req, res) {
  const { bookings } = await collections();
  const bookingData = req.body;
  const result = await bookings.insertOne(bookingData);
  return success(res, result, 201);
}

async function listBookings(req, res) {
  const { bookings } = await collections();
  const data = await bookings.find().sort({ _id: -1 }).toArray();
  return success(res, data);
}

async function updateBooking(req, res) {
  const { bookings } = await collections();
  const id = toObjectId(req.params.id);

  if (!id) {
    throw new AppError("Invalid booking id", 400);
  }

  const result = await bookings.updateOne(
    { _id: id },
    { $set: req.body },
  );
  return success(res, result);
}

async function deleteBooking(req, res) {
  const { bookings } = await collections();
  const id = toObjectId(req.params.id);

  if (!id) {
    throw new AppError("Invalid booking id", 400);
  }

  const result = await bookings.deleteOne({ _id: id });
  return success(res, result);
}

module.exports = { createBooking, listBookings, updateBooking, deleteBooking };

