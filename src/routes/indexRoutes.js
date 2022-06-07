const router = require('express')();

router.use("/users", require("./usersRoutes"));
router.use("/groups", require("./groupsRoutes"));
router.use("/tasks", require("./tasksRoutes"));

module.exports = router;