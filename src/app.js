const morgan = require('morgan');
const cors = require('cors');

const app = require('express')();

// middleware
app.use(morgan('dev'));
app.use(cors());
app.use(require("express").json());

// routes
app.use("/api/v1", require("./routes/indexRoutes"));

module.exports = app;