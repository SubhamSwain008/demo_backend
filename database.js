import mongoose from "mongoose";

export const database=async()=>{
    try{
            await mongoose.connect(process.env.MONGO_URI);
            console.log("DB connected");
    }
    catch(e){
        console.log(e)
    }
}