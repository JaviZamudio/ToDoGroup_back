const router = require('express').Router();
const { getAllUsers, getUserById, register, login } = require('../controllers/usersControl');
const { auth } = require('../middleware/auth');

router.post("/register", register)
router.post("/login", login)
router.use(auth);
router.get("/", getAllUsers)
router.get("/:id", getUserById)

module.exports = router;