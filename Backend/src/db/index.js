import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
});

const connectDB = async () => {
    try {
        console.log("Prakash");
        console.log(process.env.MONGODB_URI);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`MongoDB connected !!`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
}

export default connectDB;