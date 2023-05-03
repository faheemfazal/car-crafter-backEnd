// const mongoose= require('mongoose');
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const connectDB = async () => {
    try {
        console.log("sdgs");
      const conn = await mongoose.connect(process.env.MONGO_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        
      })
  
      console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
      console.error(`Error: ${error.message}`)
      process.exit(1)
    }
  }
// module.exports=connectDB
export default connectDB


