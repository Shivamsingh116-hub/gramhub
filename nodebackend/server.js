const http=require('http')
const express=require('express')
const app=express()
const server=http.createServer(app)
const dotenv=require('dotenv')
dotenv.config()
const dbConnection=require('./src/config/db')
app.get('/',(req,res)=>{
    res.send("WORKING SERVER")
})
server.listen(process.env.PORT || 4000,(req,res)=>{
    console.log("server is running successfully")
})