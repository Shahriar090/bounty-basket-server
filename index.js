const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

// mongodb uri

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.caldhyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// collections
const flashSaleCollection = client.db("bountyBasket").collection("flashSale");
const allProductsCollection = client
  .db("bountyBasket")
  .collection("all-products");
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// main api starts from here

// all products
// app.get("/all-products", async (req, res) => {
//   const cursor = allProductsCollection.find();
//   const result = await cursor.toArray();
//   res.send(result);
// });

// flash sale api
app.get("/flash-sale", async (req, res) => {
  const cursor = flashSaleCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

// some data based on category

// app.get("/all-products", async (req, res) => {
//   const { category } = req.query;
//   const query = category ? { category } : {};

//   try {
//     const products = await allProductsCollection.find(query).toArray();
//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// trending products

app.get("/all-products", async (req, res) => {
  const { category, sort, limit } = req.query;
  const query = category ? { category } : {};
  const sortOption = sort === "rating" ? { rating: -1 } : {};
  const limitOption = parseInt(limit, 10) || 0;

  try {
    const products = await allProductsCollection
      .find(query)
      .sort(sortOption)
      .limit(limitOption)
      .toArray();
    res.json(products);
  } catch (error) {
    console.error("Error Fetching Products", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// main api ends here

// test routes

app.get("/", (req, res) => {
  res.send("bounty basket server is running");
});

app.listen(port, () => {
  console.log(`Bounty Basket Server Is Running On Port : ${port}`);
});
