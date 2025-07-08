const http = require('http')
const express = require('express')
const app = express()
const CORS = require('cors')
const server = http.createServer(app)
const dotenv = require('dotenv')
dotenv.config()
const dbConnection = require('./src/config/db')
const router = require('./src/routes/authRoutes')
const uploadRouter = require('./src/routes/uploadRoutes')
app.use(CORS({
    origin: [process.env.LOCALHOST_URL, process.env.FRONTEND_URL,],
    credentials: true
}))
app.use(express.json())
app.use("/api/auth", router)
app.use("/api/upload", uploadRouter)
app.get('/', (req, res) => {
    res.send("WORKING SERVER")
})
server.listen(process.env.PORT || 5000, (req, res) => {
    console.log(`Server is running on port ${process.env.PORT}`)
})