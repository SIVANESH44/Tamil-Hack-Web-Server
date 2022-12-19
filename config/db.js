const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser : true,
            useUnifiedTopology : true
            // useFindAndModify : false
        }) 

        console.log(`Mongo DB connected : ${conn.connection.host}`.blue.bold);
    }
    catch(err){
        console.log(err.red);
        process.exit(1);
    }
}

module.exports = connectDB;