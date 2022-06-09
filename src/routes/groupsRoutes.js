const { getAllGroups, createGroup, getGroupsByUserId, getGroupById, updateGroup, deleteGroup, addAdmin } = require("../controllers/groupsControl");
const { auth } = require("../middleware/auth");
const router = require("express").Router();

router.get("/all", getAllGroups); // dev
router.get("/groupById", auth, getGroupById);
router.get("/groupByUserId", auth, getGroupsByUserId);

router.post("/create", auth, createGroup);
router.post("/addAdmin", auth, addAdmin);

router.put("/", auth, updateGroup);

router.delete("/", auth, deleteGroup);

module.exports = router;