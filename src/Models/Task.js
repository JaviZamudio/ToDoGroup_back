const { Schema } = require("mongoose");

// model for tasks
const taskSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    completed: {
        type: Boolean,
        default: false
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: "Group",
        required: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
});
const Task = mongoose.model("Task", taskSchema);

module.exports = { Task };