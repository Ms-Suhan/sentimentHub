require('dotenv').config()

const URL = process.env.MONGODB_URI
const mongoose = require('mongoose')


async function dbConnect(){
    try {

        const connection = await mongoose.connect(`${URL}/sentimentalhub`)
        console.log("MongoDb Connected Successfully");
        
    } catch (error) {
        console.log(`Error :: config/db.js :: While connecting to mongodb : ${error}`);
        process.exit(1);
    }
}


module.exports = dbConnect
