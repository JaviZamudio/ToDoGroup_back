const router = require('express')();

router.use("/users", require("./usersRoutes"));
router.use("/tasks", require("./tasksRoutes"));
router.use("/groups", require("./groupsRoutes"));

module.exports = router;