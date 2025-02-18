const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const dbConnect = async() =>{
    try {
       const connection  = await mongoose.connect(process.env.MONGODB_URI,{

       })
       console.log("database connected successfully ");
    } catch (error) {
        console.log(error);
    }
}

module.exports = dbConnect