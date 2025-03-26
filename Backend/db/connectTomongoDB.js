import mongoose from "mongoose";

const connectTomongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
    }
};

export default connectTomongoDB;