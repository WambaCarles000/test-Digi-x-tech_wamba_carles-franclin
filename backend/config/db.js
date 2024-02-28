//DATABASE CONFIGURATION

const mongoose = require("mongoose");



const connectDB = async () => {

    try {

        mongoose.set("strictQuery",false);
       await mongoose.connect(process.env.MONGO_URI)

            console.log("Connection to mongoDB succeed !");
    
    }catch (err){
   

        console.error(err.messsage);
        process.exit(1);
 
    }
};

module.exports = connectDB;

/*const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connection to MongoDB succeed!");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;*/
