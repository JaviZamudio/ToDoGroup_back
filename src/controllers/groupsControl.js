const { default: mongoose, Mongoose } = require("mongoose");
const { generateInviteCode } = require("../functions/functions");
const { Group } = require("../Models/Group");
const { User } = require("../models/User");

const groupsControl = {
    // GET
    getAllGroups: (req, res) => {
        Group.find()
            .then(groups => {
                return res.status(200).json({ code: 200, message: "Groups found", data: groups });
            })
            .catch(error => {
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });
    },

    getGroupById: (req, res) => {
        const { id } = req.params;
        Group.findById(id)
            .then(group => {
                return res.status(200).json({ code: 200, message: "Group found", data: group });
            })
            .catch(error => {
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });
    },

    getGroupsByUserId: (req, res) => {

    },

    // POST
    createGroup: async (req, res) => {
        const { name, description, color } = req.body;
        const creator = req.user._id;
        const admins = [creator];
        const members = [creator];
        const tasks = [];
        const inviteCode = await generateInviteCode();

        // check if fields are missing
        if (!name || !creator) {
            return res.status(400).json({ code: 400, message: "Fields missing" });
        }

        await Group.create({ name, description, creator, admins, members, tasks, inviteCode, color })
            .then(group => {
                return res.status(201).json({ code: 201, message: "Group created", data: group });
            })
            .catch(error => {
                console.log(error);
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });
    },

    // PUT
    updateGroup: (req, res) => {
        const { id } = req.params;
        const { name, description } = req.body;
        Group.findByIdAndUpdate(id, { name, description }, { new: true })
            .then(group => {
                return res.status(200).json({ code: 200, message: "Group updated", data: group });
            })
            .catch(error => {
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });
    },

    // DELETE
    deleteGroup: (req, res) => {
        const { id } = req.params;
        Group.findByIdAndDelete(id)
            .then(group => {
                return res.status(200).json({ code: 200, message: "Group deleted", data: group });
            })
            .catch(error => {
                return res.status(500).json({ code: 500, message: "Internal Server Error" });
            });
    }
};

module.exports = groupsControl;