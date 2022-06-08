const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT } = require("../config/config");
const { default: mongoose } = require("mongoose");

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
        try {
            const users = await User.find();
            if (!users) {
                return res.status(404).json({ code: 404, message: "Users not found" });
            }

            return res.status(200).json({ code: 200, data: users });
        } catch (error) {
            return res.status(500).json({ code: 500, message: "Internal Server Error" });
        }
    },

    getUser: async (req, res) => {
        // Get userId
        const userId = req.user._id;

        try {
            const user = await User.findById(userId);
            return res.status(200).json({ code: 200, data: user });
        } catch (error) {
            return res.status(500).json({ code: 500, message: "Internal Server Error" });
        }
    },

    getUserById: async (req, res) => {
        // Get id
        const { id } = req.body;

        // Check if there is user id
        if (!id) {
            return res.status(400).json({ code: 1, message: "Fields missing" });
        }

        // Check if id is valid
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ code: 2, message: "Id is not valid" });
        }

        // Get user
        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ code: 404, message: "User not found" });
            }

            return res.status(200).json({ code: 200, data: user });
        } catch (error) {
            return res.status(500).json({ code: 500, message: "Internal Server Error" });
        }
    },

    // POST
    register: async (req, res) => {
        // get fields from body
        const { name, email, password, avatar, userName } = req.body;

        // validate fields
        if (!name || !email || !password || !userName) {
            return res.status(400).json({ code: 1, message: "Fields missing" });
        }

        // check if user already exists
        const user = await User.findOne({ userName });
        if (user) {
            return res.status(400).json({ code: 4, message: "User already exists" });
        }

        // check if email already exists
        const userEmail = await User.findOne({ email });
        if (userEmail) {
            return res.status(400).json({ code: 5, message: "Email already exists" });
        }

        // hash password
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        // Create new user
        try {
            const user = await User.create({ name, email, password: hashPassword, avatar, userName });
            return res.status(201).json({ code: 201, message: "User created", data: user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ code: 500, message: "Internal Server Error" });
        }

    },

    login: async (req, res) => {
        // Get user from request
        const { userName, password } = req.body;

        // Check if fields are complete
        if (!userName || !password) {
            return res.status(400).json({ code: 1, message: "Fields missing" });
        }

        // Get user by userName
        try {
            const user = await User.findOne({ userName });

            if (!user) {
                return res.status(404).json({ code: 3, message: "User not found" });
            }

            // Check if password is correct
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ code: 6, message: "Password incorrect" });
            }

            // Return token
            const token = jwt.sign({ _id: user._id, name: user.name }, JWT.SECRET);
            return res.status(200).header("Authorization", token).json({ code: 200, message: "Logged in" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ code: 500, message: "Internal Server Error" });
        }
    },

    // PUT
    updateUser: async (req, res) => {
        const userId = req.user._id;
        const { name, email, password, avatar, userName } = req.body;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ code: 404, message: "User not found" });
        }

        // Check if email already exists
        const userWithEmail = email ? await User.findOne({ email }) : null;
        if (userWithEmail && userWithEmail._id != userId) {
            return res.status(400).json({ code: 5, message: "Email already exists" });
        }

        // Check if userName already exists
        const userWithUserName = userName ? await User.findOne({ userName }) : null;
        if (userWithUserName && userWithUserName._id != userId) {
            return res.status(400).json({ code: 4, message: "User already exists" });
        }

        // Update user
        try {
            await User.findByIdAndUpdate(userId, { name, email, password, avatar, userName });
            return res.status(200).json({ code: 200, message: "User updated" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ code: 500, message: "Internal Server Error" });
        }
    },

    // DELETE
    deleteUser: async (req, res) => {
        const userId = req.user._id;

        // Delete user
        User.findByIdAndDelete(userId)
            .then(() => {
                return res.status(200).json({ code: 200, message: "User deleted" });
            })
            .catch(error => {
                console.log(error);
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });
    }
};

module.exports = usersControl;