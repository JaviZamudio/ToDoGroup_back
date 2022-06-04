const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const {token} = req.headers;
    if(!token){
        return res.status(401).json({code: 401, message: "Unauthorized"});
    }
    try{
        const decoded = jwt.verify(token, process.env.SECRET);
        
        next();
    } catch (error) {
        return res.status(401).json({code: 401, message: "Unauthorized"});
    }
}