const { ObjectId } = require("mongodb");

function isValidObjectId(id) {
  return ObjectId.isValid(id);
}

function toObjectId(id) {
  if (!isValidObjectId(id)) {
    return null;
  }
  return new ObjectId(id);
}

module.exports = { isValidObjectId, toObjectId };
