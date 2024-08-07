const mongoose = require('mongoose');

const connectToDB = async () => {
    mongoose.connection.on('connected', () => console.log('DB is connected'));
    mongoose.connection.on('disconnected', () => console.log('db is disconnected'));
    mongoose.connection.on('reconnected', () => console.log('db is reconnected'));      
    mongoose.connection.on('close', () => console.log('db connection is close'));
    try {
        await mongoose.connect(process.env.DB_STR);
        Promise.resolve();
    } catch (error) {
        mongoose.connection.close();
        Promise.reject(error)
    }
}

module.exports = connectToDB;