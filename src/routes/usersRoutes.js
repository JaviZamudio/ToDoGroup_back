const router = require('express').Router();
const { getAllUsers, getUserById, register } = require('../controllers/usersControl');

router.post("/", register)
router.get("/", getAllUsers)
router.get("/:id", getUserById)

module.exports = router;