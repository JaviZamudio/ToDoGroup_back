const router = require('express').Router();
const { getAllUsers, register, login, updateUser, getUser, getUserById, deleteUser, joinGroup } = require('../controllers/usersControl');
const { auth } = require('../middleware/auth');

router.get("/", auth, getUser);
router.get("/all", getAllUsers);
router.get("/userById", getUserById);

router.post("/register", register);
router.post("/login", login);
router.post("/joinGroup", auth, joinGroup);

router.put("/", auth, updateUser);

router.delete("/", auth, deleteUser);

module.exports = router;