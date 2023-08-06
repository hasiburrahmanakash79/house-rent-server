const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

// Middle ware
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.guqonkt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    const usersCollection = client.db("houseRent").collection("users");
    const bookingCollection = client.db("houseRent").collection("bookings");

    app.get('/bookings', async (req, res) => {
      const result = await bookingCollection.find().toArray();
      res.send(result)
    })

    app.get('/ascendingPrice', async (req, res) => {
      const result = await bookingCollection
        .find()
        .sort({ amount: 1 })
        .toArray()
      res.send(result)
    })
    app.get('/descendingPrice', async (req, res) => {
      const result = await bookingCollection
        .find()
        .sort({ amount: -1 })
        .toArray()
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('House rent')
})

app.listen(port, () => {
  console.log(`House rent server is running on port ${port}`)
})