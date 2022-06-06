const router = require('express').Router();
const { getAllUsers, getUserById, register, login } = require('../controllers/usersControl');

router.post("/", register)
router.post("/login", login)
router.get("/", getAllUsers)
router.get("/:id", getUserById)

module.exports = router;