const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();
// app.use(cors());
// add modify cors
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://doc-appoint-vert.vercel.app"
    ],
    credentials: true
  })
);

app.use(express.json());
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`),
);

// verifyToken
const verifyToken = async (req, res, next) => {
  const authHeader = req?.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      message: "Unauthorized, please login first",
    });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized, please login first",
    });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS);
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }
};

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const db = client.db("doc-appoint");
    const doctorsCollections = db.collection("doctors");
    const bookingCollections = db.collection("booking");

    // all-doctors
    app.get("/doctors", verifyToken, async (req, res) => {
      const cursor = doctorsCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // specific doctors
    app.get("/doctors/:id", async (req, res) => {
      const { id } = req.params;
      const Id = { _id: new ObjectId(id) };
      const result = await doctorsCollections.findOne(Id);
      res.send(result);
    });

    //topSpecialists
    app.get("/topSpecialists", async (req, res) => {
      const cursor = doctorsCollections.find().sort({ rating: -1 }).limit(3);
      const result = await cursor.toArray();
      res.send(result);
    });

    // bookingInfo
    app.post("/booking", async (req, res) => {
      const bookingData = req.body;
      console.log(bookingData);
      const result = await bookingCollections.insertOne(bookingData);
      res.json(result);
    });

    // get bookingInfo
    app.get("/booking", verifyToken, async (req, res) => {
      const result = await bookingCollections.find().toArray();
      res.json(result);
    });

    // delete api
    app.delete("/booking/:id", async (req, res) => {
      const { id } = req.params;
      const result = await bookingCollections.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    // edit bookingInfo
    app.patch("/booking/:id", async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      const result = await bookingCollections.updateOne(
        {
          _id: new ObjectId(id),
        },
        { $set: updateData },
      );
      res.json(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});
