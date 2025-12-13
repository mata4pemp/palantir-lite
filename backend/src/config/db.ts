//TS node specific: connecting to Mongo, adds type safety to mongo connection, 
//connectDB returns a promise

import mongoose from 'mongoose';

//promise void, async function doesnt return anything
export const connectDB = async(): Promise<void> => {
    try{
        await mongoose.connect(process.env.MONGO_URI as string);
    } catch (error) {
        console.error('MongoDB conenction error:', error);
        process.exit(1); //stop process immediatley
    }
}