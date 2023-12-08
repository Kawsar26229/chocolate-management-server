const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// Connection URI for the MongoDB server
const uri = "mongodb://localhost:27017";

// Create a new MongoClient instance
const client = new MongoClient(uri);

async function connectToDB() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB");
    // Access a specific database
    const chocolateCollection = client
      .db("chocolateDB")
      .collection("chocolate");
    app.post("/chocolates", async (req, res) => {
      const chocolate = req.body;
      const result = await chocolateCollection.insertOne(chocolate);
      res.send(result);
    });
    app.get("/chocolates", async (req, res) => {
      const result = await chocolateCollection.find().toArray();
      res.send(result);
    });
    app.delete("/chocolates/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await chocolateCollection.deleteOne(query)
      res.send(result)
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
connectToDB();

app.listen(port, () => {
  console.log(`Chocolate Server is running on port ${port}`);
});
