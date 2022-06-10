const { Schema, default: mongoose } = require("mongoose");

// model for tasks
const taskSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        default: "todo",
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: "Group",
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
});
const Task = mongoose.model("Task", taskSchema);

module.exports = { Task };