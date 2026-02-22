import mongoose from 'mongoose';
import {DB_NAME, DB_URI, NODE_ENV} from "../config/env.js";

if (!DB_URI) throw new Error('Please define the MONGODB_URI environment variable inside' +
    ' .env.' + NODE_ENV + '.local');

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI, {
            dbName: DB_NAME || 'subscription_tracker',
        });
        console.log('Connected to MongoDB in ' + NODE_ENV + ' mode');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

export default connectDB;