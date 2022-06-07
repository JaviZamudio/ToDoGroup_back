const router = require('express').Router();
const { getAllUsers, getUserById, register, login } = require('../controllers/usersControl');
const { auth } = require('../middleware/auth');

router.post("/register", register)
router.post("/login", login)

//Auth
router.get("/", auth, getAllUsers)
router.get("/:id", auth, getUserById)

module.exports = router;