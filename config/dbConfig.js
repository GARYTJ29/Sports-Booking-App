const mongoose = require('mongoose');

const connect = mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

// Checking if the connection to mongoDB is working
connection.on('connected', () => console.log('MongoDB connected.'))
connection.on('error', (error) => console.log(`MongoDB connection error ${error}`))

module.exports = mongoose;