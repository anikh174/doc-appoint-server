const { collections } = require("../db");
const { success } = require("../utils/api-response");
const { AppError } = require("../utils/app-error");
const { toObjectId } = require("../utils/validate-object-id");

function buildDoctorFilter(query) {
  const { search, specialty } = query;
  const filter = {};

  if (search) {
    const pattern = { $regex: String(search), $options: "i" };
    filter.$or = [{ name: pattern }, { specialty: pattern }];
  }

  if (specialty) {
    filter.specialty = { $regex: String(specialty), $options: "i" };
  }

  return filter;
}

async function listDoctors(req, res) {
  const { doctors } = await collections();
  const filter = buildDoctorFilter(req.query);

  const data = await doctors.find(filter).toArray();
  return success(res, data);
}

async function getDoctor(req, res) {
  const { doctors } = await collections();
  const id = toObjectId(req.params.id);

  if (!id) {
    throw new AppError("Invalid doctor id", 400);
  }

  const doctor = await doctors.findOne({ _id: id });
  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  return success(res, doctor);
}

async function topSpecialists(req, res) {
  const { doctors } = await collections();
  const data = await doctors.find().sort({ rating: -1 }).limit(3).toArray();
  return success(res, data);
}

module.exports = { listDoctors, getDoctor, topSpecialists };
