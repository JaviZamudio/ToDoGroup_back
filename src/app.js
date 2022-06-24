const morgan = require('morgan');
const cors = require('cors');
const bodyparser = require('body-parser');
const path = require('path');
const express = require('express');

const app = require('express')();

// middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
// app.use(bodyparser.urlencoded({extended: false}));
//public folder
app.use(express.static(path.join(__dirname, '../public')));

// routes
app.use("/api/v1", require("./routes/indexRoutes"));

module.exports = app;