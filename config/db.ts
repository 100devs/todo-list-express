import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoDbUri = process.env.mongoUri as string
        const conn = await mongoose.connect(mongoDbUri)
        if (!process.env.mongoUri) {
          throw new Error('MongoDB_URI is not defined in environment variables.');
        }
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

export default connectDB