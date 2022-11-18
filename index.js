const express = require("express")
const app = express();
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');

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
const serviceCollection = client.db("Green_chilli").collection("services")




// read /get services from DB 
app.get('/service', async(req, res)=>{
    try{
        const cursor = serviceCollection.find({})
        const services =  await cursor.limit(3).toArray()
        res.send(services)
    }
    catch(err){
        console.log(err.name.bgRed, err.message.bold)
        res.send({
            success: false , 
            error: "Coldn't get service from db "
        })
    }
})

app.get('/', (req, res)=>{
    res.send("Server is running ...")

})
app.listen(port , ()=>{
    console.log(`server is running on port ${port}`.yellow )
})

