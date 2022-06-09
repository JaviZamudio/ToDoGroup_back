const { generateInviteCode } = require("../functions/functions");
const { Group } = require("../Models/Group");
const { User } = require("../models/User");

const groupsControl = {
    // GET
    getAllGroups: (req, res) => {
        Group.find()
            .then(groups => {
                // Check if there are groups
                if (!groups) {
                    return res.status(404).json({ code: 404, message: "Groups not found" });
                }

                // Return groups
                return res.status(200).json({ code: 200, message: "Groups", data: groups });
            })
            .catch(error => {
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });
    },

    getGroupById: (req, res) => {
        const { groupId } = req.body;

        // Check if Fields are missing
        if (!groupId) {
            return res.status(400).json({ code: 1, message: "Fields missing" });
        }

        Group.findById(groupId)
            .then(group => {
                // Check if group exists
                if (!group) {
                    return res.status(404).json({ code: 404, message: "Group not found" });
                }

                // Return group
                return res.status(200).json({ code: 200, message: "Group found", data: group });
            })
            .catch(error => {
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });
    },

    getGroupsByUserId: (req, res) => {
        const userId = req.user._id;
        Group.find({ members: userId })
            .then(groups => {
                // Check if there are any groups
                if (!groups) {
                    return res.status(404).json({ code: 404, message: "Groups not found" });
                }

                // Return groups
                return res.status(200).json({ code: 200, message: "Groups found", data: groups });
            })
            .catch(error => {
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });
    },

    // POST
    createGroup: async (req, res) => {
        const { name, description } = req.body;
        const color = req.body.color > 20 ? 0 : req.body.color;
        const creator = req.user._id;
        const admins = [creator];
        const members = [creator];
        const tasks = [];
        const inviteCode = await generateInviteCode();

        // check if fields are missing
        if (!name || !description) {
            return res.status(400).json({ code: 1, message: "Fields missing" });
        }

        // Create group
        Group.create({ name, description, creator, admins, members, tasks, inviteCode, color })
            .then(group => {
                // Add group to user
                User.findByIdAndUpdate(creator, { $push: { groups: group._id } })
                    .then(user => {
                        // Return group
                        return res.status(200).json({ code: 200, message: "Group created", data: group });
                    })
                    .catch(error => {
                        return res.status(500).json({ code: 500, message: "Internal Server Error" });
                    });
            })
            .catch(error => {
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });
    },

    addAdmin: async (req, res) => {
        const userId = req.user._id;
        const { groupId, adminId } = req.body;

        // check if fields are missing
        if (!groupId || !adminId) {
            return res.status(400).json({ code: 400, message: "Fields missing" });
        }

        const group = await Group.findById(groupId);

        // check if group exists
        if (!group) {
            return res.status(400).json({ code: 400, message: "Group not found" });
        }

        // check if current user is admin
        if (!group.admins.includes(userId)) {
            return res.status(400).json({ code: 400, message: "Current user is not admin" });
        }

        // check if admin is in group
        if (!group.members.includes(adminId)) {
            return res.status(400).json({ code: 400, message: "Admin is not in group" });
        }

        // check if user is already admin
        if (group.admins.includes(adminId)) {
            return res.status(400).json({ code: 400, message: "User is already admin" });
        }

        try {
            group.admins.push(adminId);
            await group.save();
            return res.status(200).json({ code: 200, message: "User added to admins", data: group });
        } catch (error) {
            return res.status(500).json({ code: 500, message: "Internal Server Error" });
        }
    },

    // PUT
    updateGroup: async (req, res) => {
        const userId = req.user._id;
        const { groupId, name, description, color } = req.body;

        // check if groupId is missing
        if (!groupId) {
            return res.status(400).json({ code: 1, message: "Fields missing" });
        }

        //check if user is admin
        Group.findById(groupId)
            .then(group => {
                if (!group) {
                    return res.status(400).json({ code: 400, message: "Group not found" });
                }

                if (!group.admins.includes(userId)) {
                    return res.status(400).json({ code: 400, message: "Current user is not admin" });
                }

                group.name = name || group.name;
                group.description = description || group.description;
                group.color = color || group.color;

                group.save()
                    .then(group => {
                        // Return group
                        return res.status(200).json({ code: 200, message: "Group updated", data: group });
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
    deleteGroup: async (req, res) => {
        const userId = req.user._id;
        const { groupId } = req.body;

        await Group.findById(groupId)
            .then(group => {
                if (!group) {
                    return res.status(400).json({ code: 400, message: "Group not found" });
                }

                if (!group.admins.includes(userId)) {
                    return res.status(401).json({ code: 401, message: "User not allowed" });
                }

                // Delete group from groups
                Group.findByIdAndDelete(groupId)
                    .then(group => {
                        return res.status(200).json({ code: 200, message: "Group " + group.name + " deleted" });
                    })
                    .catch(error => {
                        return res.status(500).json({ code: 500, message: "Internal Server Error" });
                    });

                // Delete group from users
                User.find({ groups: groupId })
                    .then(users => {
                        users.forEach(user => {
                            user.groups.pull(groupId);
                            user.save();
                        });
                    })
                    .catch(error => {
                        return res.status(500).json({ code: 500, message: "Internal Server Error" });
                    });

                // Delete tasks belonging to group
                Task.find({ group: groupId })
                    .then(tasks => {
                        tasks.forEach(task => {
                            task.remove();
                        });
                    })
                    .catch(error => {
                        return res.status(500).json({ code: 500, message: "Internal Server Error" });
                    });
            })
            .catch(error => {
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });
    }
};

module.exports = groupsControl;