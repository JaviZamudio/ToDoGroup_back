const {MONGODB} = require('./config');
const mongoose = require('mongoose');

async function connect() {
    // console.log('Attempting to connect to mongoDB Atlas...');
    try {
        await mongoose.connect(`mongodb+srv://${MONGODB.USER}:${MONGODB.PASSWORD}@${MONGODB.HOST}/${MONGODB.DB}?retryWrites=true&w=majority`);
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        await connectLocal();
    }
}

async function connectLocal() {
    try {
        await mongoose.connect(`mongodb://localhost:27017/${MONGODB.DB}`);
        console.log('Connected to MongoDB locally');
    } catch (error) {
        console.log(error);
    }
}

module.exports = {connect, connectLocal};