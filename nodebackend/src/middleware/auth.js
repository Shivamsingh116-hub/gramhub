const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwt_secret_key = process.env.JWT_SECRET_KEY
const verifyToken = (req, res, next) => {

    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Access Denied: No token provided" })
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, jwt_secret_key)
        req.user = decoded
        next()
    } catch (e) {
        console.log(e)
        if (e.name === 'TokenExpiredError') {
            return res.status(440).json({ error: 'Session expired. Please log in again.' });
        } else if (e.name === 'JsonWebTokenError') {
            return res.status(440).json({ error: 'Invalid token. Access denied.' });
        } else {
            return res.status(401).json({ error: 'Authentication failed.' });
        }
    }
}
module.exports = verifyToken