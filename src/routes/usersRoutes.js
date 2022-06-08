const router = require('express').Router();
const { getAllUsers, register, login, updateUser, getUser, getUserById, deleteUser } = require('../controllers/usersControl');
const { auth } = require('../middleware/auth');

router.get("/", auth, getUser);
router.get("/all", getAllUsers);
router.get("/userById", getUserById);

router.post("/register", register);
router.post("/login", login);

router.put("/update", auth, updateUser);

router.delete("/delete", auth, deleteUser);

module.exports = router;