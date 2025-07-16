const http = require('http')
const express = require('express')
const app = express()
const CORS = require('cors')
const server = http.createServer(app)
const dotenv = require('dotenv')
dotenv.config()
const connectDB = require("./src/config/db");
const router = require('./src/routes/authRoutes')
const uploadRouter = require('./src/routes/uploadRoutes')
const { getRouter } = require('./src/routes/getRoutes')
const { connected } = require('process')
const { updateRouter } = require('./src/routes/updateRoutes')
const { deleteRouter } = require('./src/routes/deleteRouter')
app.use(CORS({
    origin: [process.env.LOCALHOST_URL, process.env.FRONTEND_URL,],
    credentials: true
}))
connectDB()
app.use(express.json())
app.use("/api/auth", router)
app.use("/api/upload", uploadRouter)
app.use('/api/get', getRouter)
app.use('/api/update',updateRouter)
app.use('/api/delete',deleteRouter)
app.get('/', (req, res) => {
    res.send("WORKING SERVER")
})
server.listen(process.env.PORT || 5000, (req, res) => {
    console.log(`Server is running on port ${process.env.PORT}`)
})