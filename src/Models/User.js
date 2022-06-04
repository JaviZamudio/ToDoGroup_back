const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://cdn.icon-icons.com/icons2/933/PNG/512/user-shape_icon-icons.com_72487.png"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = model("User", userSchema);

module.exports = {User};