const morgan = require('morgan');
const cors = require('cors');
const bodyparser = require('body-parser');

const app = require('express')();

// middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

// routes
app.use("/api/v1", require("./routes/indexRoutes"));

module.exports = app;