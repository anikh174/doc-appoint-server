const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("doc-appoint");
    const doctorsCollections = db.collection("doctors");

    // all-doctors
    app.get("/doctors", async (req, res) => {
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

    //
    app.get("/topSpecialists", async (req, res) => {
      const cursor = doctorsCollections.find().sort({ rating: -1 }).limit(3);
      const result = await cursor.toArray();
      res.send(result);
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
