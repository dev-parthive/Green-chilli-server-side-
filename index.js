const express = require("express")
const app = express();
const cors = require("cors")
const { MongoClient, ServerApiVersion , ObjectId, ObjectID} = require('mongodb');
// const { ObjectId } = require("mongodb/mongodb");

require("colors")

// middleWare 
app.use(cors()) 
app.use(express.json())


const port = process.env.PORT || 5000; 

// require dotenv 
require('dotenv').config()

//make connection with DB 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.afdwhlk.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri) 

async function dbConnect() {
    try {
        await client.connect()
        console.log('dtabase connected'.blue)
    } 
    catch(error){
        console.log(error.name.bgRed, error.message.bold, error.stack)
    }
}
dbConnect()


//mongoDB connections 

//amra akane collection create korlam 
const serviceCollection = client.db("Green_chilli").collection("services") 
const reviewCollection = client.db("Green_chilli").collection("reviews")





// read /get services from DB 
//  only 3 service load  api 
app.get('/service', async(req, res)=>{
    try{
        const cursor = serviceCollection.find({})
        const services =  await cursor.limit(3).toArray()
        res.send({
            success: true, 
            message: " got 3 product form DB " , 
            data : services
        })
    }
    catch(err){
        console.log(err.name.bgRed, err.message.bold)
        res.send({
            success: false , 
            error: "Coldn't get service from db "
        })
    }
}) 

// all services load api 
app.get('/services', async(req, res)=>{
    try{
        const cursor = serviceCollection.find({})
        const services  = await cursor.toArray()
        res.send({
            success :true, 
            message: "load every services  form DB " ,
            data: services 
        })
    }
    catch(err){
        res.send({
            success: false,
            error : "couldn't load the data "
        })
    }
}) 

//to get the specific service 
app.get('/product/:id',  async(req, res)=>{
    try{
        const id = req.params.id
        // console.log(id)
       const service = await serviceCollection.findOne({_id: ObjectId(id)})
        res.send({
            success: true,
            message: 'got the product', 
            product: service 
        })

    }
    catch(err){
        res.send({
            success: false, 
            error: err.message
        })
    }
})

// add review api 
app.post('/addReview', async(req, res) =>{
    try{
        const result = await reviewCollection.insertOne(req.body)
        if(result.insertedId){
            res.send({
                success: true,
                message: "Review added in DB"

            })
        }else{
            res.send({
                success: false,
                error: "Couldn't add the review"
            })
        }
    }
    catch(err){
        console.log(err.name.bgRed, err.message.bold)
        res.send({
            success: false,
            error: err.message ,
        })
    }
})

// akan kaj holo  review ta k find kore niye asa product_id idye 
app.get('/addReview/:id', async(req, res) =>{
    try{
        const id = req.params.id 
        const query = {product_id:(id)}
        const cursor =  reviewCollection.find(query)
        const review = await cursor.toArray()
        res.send({
            success: true, 
            data: review
        })
    }
    catch(err){
        res.send({
            success: false,
            error: err.message
        })
    }
}) 

//akn kaj holo ak jon user er koita review ase ta dhekar
app.get('/review/:email', async(req, res)=>{
    try{
        const email = req.params.email
        const query = {email: (email)}
        const cursor = reviewCollection.find(query)
        const reviews =  await cursor.toArray()
        res.send({
            success: true ,
            data: reviews
        })
    }
    catch(err){
        res.send({
            success: false, 
            error: err.message
        })
    }
})

// get the specific review using id 
app.get('/edit-review/:id', async(req, res)=>{
    try{
        const id = req.params.id
        const review = await reviewCollection.findOne({_id: ObjectId(id)})
        res.send({
            success: true, 
            data : review
        })
    }
    catch(error){
        res.send({
            success: false,
            error: error.message
        })
    }
}) 

//akn kaj holo edit kora remview db ta patano 

app.patch("/edit-review/:id", async (req, res)=>{
    const id = req.params.id
    try{
        const result = await reviewCollection.updateOne({_id: ObjectId(id)}, {$set: req.body})
        if(result.modifiedCount){
            res.send({
                success: true, 
                message: "successfully update"
            })
        }else{
            res.send({
                success: false,
                error: "Couldn't update the review"
            })
        }
    }
    catch(err){
        res.send({
            success: false,
            error: err.message
        })

    }
})

// akn time holo reveiew delete koara 
app.delete(`/delete/:id`, async(req,res)=>{
    const id = req.params.id
    try{
        const result = await reviewCollection.deleteOne({_id: ObjectId(id)})
        if(result.deletedCount){
            console.log("Successfully deleted".yellow)
            res.send({
                success: true, 
                message: "review is deleted"
            })
        }
        else{
            console.log("something went wrong".red)

        }
    }
    catch(err){
        res.send({
            success: false, 
            error: err.message
        })
    }
})
//create new service 


app.post('/add-service', async(req, res) =>{

    try{
        const result = await serviceCollection.insertOne(req.body);
        if(result.insertedId){
            res.send({
                success: true,
                message: `successfully created teh ${req.body.name} product with id ${result.insertedId}`
            })
        }
        else{
            res.send({
                success: false,
                error: "Couldn't create the service"
            })
        }
    }
    catch(err){
        console.log(err.name.bgRed, err.message.bold)
        res.send({
            success: false,
            error: err.message
        })
    }
})


app.get('/', (req, res)=>{
    res.send("Server is running ...")

})
app.listen(port , ()=>{
    console.log(`server is running on port ${port}`.yellow )
})

