const express = require("express")
const app = express();
const cors = require("cors")

require("colors")

// middleWare 
app.use(express.json())
app.use(cors()) 


const port = process.env.PORT || 5000; 

// require dotenv 
require('dotenv').config()



app.get('/', (req, res)=>{
    res.send("Server is running ...")

})
app.listen(port , ()=>{
    console.log(`server is running on port ${port}`.yellow )
})

