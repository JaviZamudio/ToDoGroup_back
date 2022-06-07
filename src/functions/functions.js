const { Group } = require("../Models/Group");

const functions = {
    // Generate a valid group invite code
    generateInviteCode: async () => {
        while (true) {
            const code = Math.random().toString(36).substring(2, 8);

            if (!await Group.findOne({ inviteCode: code })) {
                return code;
            }
        }
    },

};

module.exports = functions;