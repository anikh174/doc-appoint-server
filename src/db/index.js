const { MongoClient, ServerApiVersion } = require("mongodb");
const { env } = require("../config/env");

const DB_NAME = "doc-appoint";

let client = null;
let database = null;

async function connect() {
  if (database) {
    return database;
  }

  client = new MongoClient(env.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  database = client.db(DB_NAME);
  return database;
}

function getDb() {
  if (!database) {
    throw new Error("Database not connected. Call connect() before using the db.");
  }
  return database;
}

function getCollection(name) {
  return getDb().collection(name);
}

function collections() {
  return {
    doctors: getCollection("doctors"),
    bookings: getCollection("booking"),
  };
}

async function close() {
  if (client) {
    await client.close();
    client = null;
    database = null;
  }
}

module.exports = { connect, getDb, getCollection, collections, close, DB_NAME };
