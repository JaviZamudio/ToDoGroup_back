const { Group } = require("../Models/Group");
const { Task } = require("../Models/Task");
const { User } = require("../models/User");

const tasksControl = {
    // GET:
    getTasksByUserId: async (req, res) => {
        // Get userId
        const userId = req.user._id;

        Task.find({ users: userId })
            .then(tasks => {
                return res.status(200).json({ code: 200, data: tasks });
            })
            .catch(error => {
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });
    },

    getTasksByGroupId: (req, res) => {
        // get userId
        const userId = req.user._id;

        // Get groupId
        const groupId = req.body.groupId;

        // Check if there is group id
        if (!groupId) {
            return res.status(400).json({ code: 1, message: "Fields missing" });
        }

        // Check if group id is valid
        if (!mongoose.isValidObjectId(groupId)) {
            return res.status(400).json({ code: 2, message: "Id is not valid" });
        }

        // Get group
        Group.findById(groupId)
            .then(async group => {
                // Check if user a goup admin
                if (!group.admins.includes(userId)) {
                    return res.status(401).json({ code: 401, message: "You are not admin of this group" });
                }
            })

    },

    getTasksByGroupIdAndUserId: (req, res) => {
        // get userId
        const userId = req.user._id;

        // Get groupId
        const groupId = req.body.groupId;

        // Check if there is group id
        if (!groupId) {
            return res.status(400).json({ code: 1, message: "Fields missing" });
        }

        // Check if group id is valid
        if (!mongoose.isValidObjectId(groupId)) {
            return res.status(400).json({ code: 2, message: "Id is not valid" });
        }

        // Get tasks
        Task.find({ group: groupId, users: userId })
            .then(tasks => {
                return res.status(200).json({ code: 200, data: tasks });
            })
            .catch(error => {
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });
    },

    // POST:
    createTask: async (req, res) => {
        // Get userId
        const userId = req.user._id;

        const { title, description } = req.body;
        const creatorId = userId;
        const groupId = req.body.groupId || null;
        const users = req.body.users || [userId];

        // Check if there is title
        if (!title) {
            return res.status(400).json({ code: 1, message: "Fields missing" });
        }

        // add Task to tasks collection
        Task.create({ title, description, creator: creatorId, group: groupId, users })
            .then(async task => {
                // add task to groupId's tasks
                await Group.findByIdAndUpdate(groupId, { $push: { tasks: task._id } })

                // add task to every user's tasks
                for (let user of users) {
                    await User.findByIdAndUpdate(user, { $push: { tasks: task._id } })
                }

                return res.status(201).json({ code: 201, data: task });
            })
            .catch(error => {
                console.log(error);
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });
    },

    toggleStatus: async (req, res) => {
        // Get userId
        const userId = req.user._id;

        // Get taskId
        const { taskId } = req.body;

        // Check if there is task id
        if (!taskId) {
            return res.status(400).json({ code: 1, message: "Fields missing" });
        }

        // validate task id
        if (!mongoose.isValidObjectId(taskId)) {
            return res.status(400).json({ code: 2, message: "Id is not valid" });
        }

        // Get task
        Task.findById(taskId)
            .then(async task => {
                // Check if task is created by user 
                if (task.creator.toString() !== userId && !task.users.includes(userId) && !(await Group.findById(task.group)).admins.includes(userId)) {
                    return res.status(400).json({ code: 400, message: "Task not created by user or not in user's tasks" });
                }

                // Toggle task status
                task.status = task.status === "todo" ? "done" : "todo";
                task.save();

                return res.status(200).json({ code: 200, data: task });
            })
            .catch(error => {
                console.log(error);
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });

    },

    // PUT:
    updateTask: async (req, res) => {
        // Get userId
        const userId = req.user._id;

        // Get taskId
        const { taskId } = req.body;

        // get data to update
        const { title, description } = req.body;

        // Check if there is task id
        if (!taskId) {
            return res.status(400).json({ code: 1, message: "Fields missing" });
        }

        // validate task id
        if (!mongoose.isValidObjectId(taskId)) {
            return res.status(400).json({ code: 2, message: "Id is not valid" });
        }

        // Get task
        Task.findById(taskId)
            .then(async task => {
                // Check if task belongs to user
                if (!task.users.includes(userId) && task.creator.toString() !== userId) {
                    return res.status(400).json({ code: 400, message: "Task not created by user" });
                }

                // Update task
                task.title = title || task.title;
                task.description = description || task.description;
                await task.save();

                return res.status(200).json({ code: 200, data: task });
            })
            .catch(error => {
                console.log(error);
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });
    },

    // DELETE:
    deleteTask: async (req, res) => {
        // Get userId
        const userId = req.user._id;

        // Get taskId
        const { taskId } = req.body;

        // Check if there is task id
        if (!taskId) {
            return res.status(400).json({ code: 1, message: "Fields missing" });
        }

        // validate task id
        if (!mongoose.isValidObjectId(taskId)) {
            return res.status(400).json({ code: 2, message: "Id is not valid" });
        }

        // Get task
        Task.findById(taskId)
            .then(async task => {
                // Check if task belongs to user, or if task is created by user or if user is admin of group
                if (!task.users.includes(userId) && task.creator.toString() !== userId && !await Group.findById(task.group).admins.includes(userId)) {
                    return res.status(400).json({ code: 400, message: "User not authorized to delete task" });
                }

                // Delete task from group
                await Group.findByIdAndUpdate(task.group, { $pull: { tasks: task._id } });

                // Delete task from user
                await User.findByIdAndUpdate(userId, { $pull: { tasks: task._id } });

                // Delete task
                await task.remove();

                return res.status(200).json({ code: 200, message: "Task deleted" });
            })
            .catch(error => {
                console.log(error);
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });
    },

}

module.exports = tasksControl;