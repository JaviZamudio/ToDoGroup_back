const {User} = require("../models/User");
const bcrypt = require("bcrypt");

/* 
    Status codes:
    200: OK
    201: Created
    400: Bad Request
    401: Unauthorized
    404: Not Found
    500: Internal Server Error
*/

const usersControl = {
    // GET
    getAllUsers: async (req, res) => {
        try{
            const users = await User.find();
            return res.status(200).json({code: 200, data: users});
        } catch (error) {
            return res.status(500).json({code: 500, message: "Internal Server Error"});
        }
    },
    getUserById: async (req, res) => {
        // Get user id from request
        const {id} = req.params;

        // Check if user id is valid
        if(!id){
            return res.status(400).json({code: 400, message: "Id is required"});
        }

        // Get user by id
        try{
            const user = await User.findById(id);
            return res.status(200).json({code: 200, data: user});
        } catch (error) {
            return res.status(500).json({code: 500, message: "Internal Server Error"});
        }
    },

    // POST
    register: async (req, res) => {
        // get fields from body
        const {name, email, password, avatar, userName} = req.body;

        // validate fields
        if(!name || !email || !password || !userName){
            return res.status(400).json({code: 400, message: "Fields missing"});
        }

        // check if user already exists
        const user = await User.findOne({userName});
        if(user){
            return res.status(400).json({code: 400, message: "User already exists"});
        }
        
        // check if email already exists
        const userEmail = await User.findOne({email});
        if(userEmail){
            return res.status(400).json({code: 400, message: "Email already exists"});
        }

        // hash password
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        // Create new user
        try{
            const user = await User.create({name, email, password: hashPassword, avatar, userName});
            return res.status(201).json({code: 201, message: "User created"});
        } catch (error) {
            console.log(error);
            return res.status(500).json({code: 500, message: "Internal Server Error"});
        }

    }
};

module.exports = usersControl;