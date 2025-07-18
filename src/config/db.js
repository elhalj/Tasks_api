import mongoose from "mongoose";

export async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connect to MongoDb");
  } catch (error) {
    console.log("MongoDb Connexion failed: ", error);
    process.exit(1);
  }
}
