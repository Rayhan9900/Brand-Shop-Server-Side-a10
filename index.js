const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
require('dotenv').config()

const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lnrotgp.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();


        const brandCollection = client.db('brandDB').collection('brand');

        const productCollection = client.db('brandDB').collection('products');
        const cartCollection = client.db('brandDB').collection('carts');



        app.get('/brand', async (req, res) => {
            const result = await brandCollection.find().toArray();
            res.send(result)
        })

        app.get('/products', async (req, res) => {
            const brandName = req.query.BrandName;
            const result = await productCollection.find({ BrandName: brandName }).toArray();
            res.send(result)

        })

        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result);
        })



        app.get('/carts', async (req, res) => {
            const result = await cartCollection.find().toArray();
            res.send(result)
        })

        app.post('/carts', async (req, res) => {
            const carts = req.body;
            const result = await cartCollection.insertOne(carts);
            console.log(result);
            res.send(result)
        })


        app.post("/products", async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            console.log(result);
            res.send(result);
        });

        app.put("/products/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedUSer = {
                $set: {
                    Image: data.Image,
                    BrandName: data.BrandName,
                    Name: data.Name,
                    ShortDescription: data.ShortDescription,
                    Price: data.Price,
                    Rating: data.Rating,
                },
            };
            const result = await productCollection.updateOne(
                filter,
                updatedUSer,
                options
            );
            res.send(result);
        });


        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            console.log("delete", id);
            const query = {
                _id: new ObjectId(id),
            };
            const result = await usersCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('brand shop server is running')
})

app.listen(port, () => {
    console.log(`brand shop is Running on port ${port}`);
});