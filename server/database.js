import mongoose from "mongoose";
import * as dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI;

const connectDB = async() => {
    await mongoose
        .connect(mongoURI)
        .then(() => console.log("MongoDB connected!"))
        .catch((err) => console.log(err))
}

export default connectDB;