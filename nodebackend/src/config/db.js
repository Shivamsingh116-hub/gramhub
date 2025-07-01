const mongoose=require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Server is connected to database")
}).catch((err)=>{
    console.log(`Server is not connected to database due to ${err}`)
})
module.exports=mongoose