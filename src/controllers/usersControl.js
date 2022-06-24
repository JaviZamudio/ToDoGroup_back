const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT } = require("../config/config");
const { default: mongoose } = require("mongoose");
const { Group } = require("../Models/Group");

/* 
    Status codes:
    200: OK
    200: Created
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
        const { name, email, password, avatar } = req.body;
        const userName = req.body.userName.toLowerCase();

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
            return res.status(400).json({ code: 5, message: "There's another user with this email" });
        }

        // hash password
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        // Create new user
        try {
            const user = await User.create({ name, email, password: hashPassword, avatar, userName });
            const token = jwt.sign({ _id: user._id, name: user.name }, JWT.SECRET);
            return res.status(200).json({ code: 200, message: "User created", data: {user, token} });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ code: 500, message: "Internal Server Error" });
        }

    },

    login: async (req, res) => {
        // Get user from request
        const { password } = req.body;
        const userName = req.body.userName.toLowerCase();

        // Check if fields are complete
        if (!userName || !password) {
            console.log(req.body);
            return res.status(400).json({ code: 1, message: "Fields missing" });
        }

        try {
            // Get user by userName
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
            return res.status(200).json({ code: 200, message: "Logged in", data: { token, user } });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ code: 500, message: "Internal Server Error" });
        }
    },

    joinGroup: async (req, res) => {
        // Get userId
        const userId = req.user._id;

        // Get inviteCode
        const { inviteCode } = req.body;

        // Check if there is group id
        if (!inviteCode) {
            return res.status(400).json({ code: 1, message: "Fields missing" });
        }

        // Get group
        Group.findOne({ inviteCode })
            .then(group => {
                // Check if group exists
                if (!group) {
                    return res.status(404).json({ code: 404, message: "Group not found" });
                }

                // Check if user is already in group
                if (group.members.includes(userId)) {
                    return res.status(400).json({ code: 4, message: "User already in group" });
                }

                // Add user to group
                group.members.push(userId);
                group.save();

                // add group to user
                User.findByIdAndUpdate(userId, { $push: { groups: group._id } })
                    .then(user => {
                        return res.status(200).json({ code: 200, message: "User added to group"});
                    })
                    .catch(error => {
                        console.log(error);
                        return res.status(500).json({ code: 500, message: "Internal Server Error" });
                    });
            })
            .catch(error => {
                console.log(error);
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });
    },

    leaveGroup: async (req, res) => {
        // Get userId
        const userId = req.user._id;

        // Get groupId
        const { groupId } = req.body;

        // Check if there is group id
        if (!groupId) {
            return res.status(400).json({ code: 1, message: "Fields missing" });
        }

        // validate group id
        if (!mongoose.isValidObjectId(groupId)) {
            return res.status(400).json({ code: 2, message: "Id is not valid" });
        }

        // Get user
        User.findById(userId)
            .then(user => {
                // Check if user is in group
                if (!user.groups.includes(groupId)) {
                    return res.status(400).json({ code: 8, message: "User not in group" });
                }

                // Remove user from group
                user.groups.pull(groupId);
                user.save();

                // Remove user from group
                Group.findByIdAndUpdate(groupId, { $pull: { users: userId } })
                    .then(group => {
                        return res.status(200).json({ code: 200, message: "User removed from group" });
                    })
                    .catch(error => {
                        return res.status(500).json({ code: 500, message: "Internal Server Error" });
                    });
            })
    },

    // PUT
    updateUser: async (req, res) => {
        const userId = req.user._id;
        const { name, email, prevPassword, newPassword, avatar, userName } = req.body;

        User.findById(userId)
            .then(async user => {
                user.name = name || user.name;
                user.email = email || user.email;
                user.avatar = avatar || user.avatar;
                user.userName = userName || user.userName;

                // Check if password is changed
                if (prevPassword && newPassword && await bcrypt.compare(prevPassword, user.password)) {
                    const salt = await bcrypt.genSalt();
                    const hashPassword = await bcrypt.hash(newPassword, salt);
                    user.password = hashPassword;
                }

                user.save()
                    .then(() => {
                        return res.status(200).json({ code: 200, message: "User updated" });
                    })
                    .catch(error => {
                        return res.status(500).json({ code: 500, message: "Internal Server Error" });
                    });
            })
            .catch(error => {
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });
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