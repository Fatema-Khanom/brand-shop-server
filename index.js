const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require("cors");
const app = express();

//fatemaurmi2019
//PCVBKmKqtdciBKWW
// middleware
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5001;

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS)



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wdcasbo.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    const userCollection = client.db("addProduct").collection("addproduct")
    const productCollection = client.db('addProduct').collection('addproduct');

    app.post('/addproduct', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await productCollection.insertOne(newCoffee);
      res.send(result);
  })
      
      app.get("/addproduct/:brand", async (req, res) => {
        const brand = req.params.brand;
        console.log("brand", brand);
        const query = {
          brand: brand,
        };
        const result = await userCollection.find(query).toArray();
        console.log(result);
        res.send(result);
      });

    app.get('/addproduct/id/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query);
      res.send(result);
  })
    
    app.put('/addproduct/id/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedProduct = req.body;

      const product = {
          $set: {
             

                
              name : updatedProduct.name,
               brand : updatedProduct.brand,
               rating : updatedProduct.rating,
               type : updatedProduct.type,
               price : updatedProduct.price,
               description : updatedProduct.description,
               photo : updatedProduct.photo,
          }
      }

      const result = await productCollection.updateOne(filter, product, options);
      res.send(result);
  })

      app.get('/addproduct', async (req, res) => {
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
      


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Crud is running .....");
  });
  

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
  });