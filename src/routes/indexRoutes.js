const router = require('express')();

router.use("/users", require("./usersRoutes"));

module.exports = router;