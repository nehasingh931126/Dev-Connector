const mongoose  = require('mongoose');
const config = require('config');
const db = config.get("mongoURI");



const connectDB = async ()=> {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true, // if you get the deprecated warngin
        });
        console.log("mongdb connected");
    } catch(error) {
        console.log(error.message);
        //Exit process with Failure
        process.exit(1);
    }
}

module.exports = connectDB;