// GROUP SHCEMA 
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: false,
    }],
    inviteCode: {
        type: String,
        unique: true,
    },
});

const Group = mongoose.model('Group', groupSchema);

module.exports = { Group };