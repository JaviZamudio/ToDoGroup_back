const {MONGODB} = require('./config');
const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(`mongodb+srv://${MONGODB.USER}:${MONGODB.PASSWORD}@${MONGODB.HOST}/${MONGODB.DB}?retryWrites=true&w=majority`);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error);
    }
}

module.exports = connect;