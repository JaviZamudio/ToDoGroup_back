const { createTask, getTasksByUserId, getTasksByGroupId, getTasksByGroupIdAndUserId, toggleStatus, updateTask, deleteTask } = require('../controllers/tasksControl');
const router = require('express').Router();
const {auth} = require('../middleware/auth');

router.get("/tasksByUserId", auth, getTasksByUserId);
router.get("/tasksByGroupId", auth, getTasksByGroupId);
router.get("/tasksByGroupIdAndUserId", auth, getTasksByGroupIdAndUserId);

router.post('/', auth, createTask);
router.post("/toggleStatus", auth, toggleStatus);

router.put("/", auth, updateTask);

router.delete("/", auth, deleteTask);

module.exports = router;