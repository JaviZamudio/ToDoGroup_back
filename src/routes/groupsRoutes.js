const { getAllGroups, createGroup } = require("../controllers/groupsControl");
const { auth } = require("../middleware/auth");
const router = require("express").Router();

// Auth
router.get("/", auth, getAllGroups);
router.post("/create", auth, createGroup);

module.exports = router;