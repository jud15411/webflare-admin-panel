import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // mongoose.connect returns a promise, so we await it
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // If the connection is successful, log it to the console
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If there's an error, log it and exit the process
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;