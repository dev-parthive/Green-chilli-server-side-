const express = require("express")
const app = express();
const cors = require("cors")
const { MongoClient, ServerApiVersion , ObjectId} = require('mongodb');
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



app.get('/', (req, res)=>{
    res.send("Server is running ...")

})
app.listen(port , ()=>{
    console.log(`server is running on port ${port}`.yellow )
})

