import mongoose from "mongoose"

export const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      console.log("MongoDb Connectes SuccesFully!!");
      
    } catch (error) {
      console.log("MongoDb connection error: ",error);
      process.exit(1)
    }
}