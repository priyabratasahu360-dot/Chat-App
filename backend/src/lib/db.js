import mongoose from 'mongoose';

export const connectDb = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    }
    catch(error){
        console.log("mongoDB connection error: ", error);
    }
}