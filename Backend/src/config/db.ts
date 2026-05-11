import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URL!);
        console.log("DB Connected");
    }
    catch(error){
        console.log("DB Connection Failed");
    }
}