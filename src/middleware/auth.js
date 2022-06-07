const jwt = require('jsonwebtoken');
const { JWT } = require('../config/config');

const auth = (req, res, next) => {
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({code: 401, message: "No token provided"});
    }
    try{
        const decodedToken = jwt.verify(token, JWT.SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({code: 401, message: "Unauthorized"});
    }
}

module.exports = {
    auth
};