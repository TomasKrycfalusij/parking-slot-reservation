import mongoose, {Schema, model, connect, ObjectId, ConnectOptions } from 'mongoose';
import { env } from 'process';

export interface DayType {
    _id: string | ObjectId;
    date: Date;
    capacity: number;
    bookings: string[];
}
  
const MONGO_URI = String(env.DATABASE_URL);
  
const daySchema = new Schema<DayType>({
  _id: { type: String, required: true },
  date: { type: Date, required: true },
  capacity: { type: Number, required: true },
  bookings: { type: [String], default: [] },
});

export const connectToDatabase = async () => {
    console.log('Connecting to MongoDB');
    try {
      const mongoose = await connect(MONGO_URI, {
      } as ConnectOptions);
      console.log('Connected to MongoDB');
      return mongoose;
  
    } catch (error) {
      console.error('Error connecting to database.', error);
    }
}

export const getDaysFromDatabase = async () =>{
    try {
      const mongoose = await connectToDatabase();
      const Day = mongoose!.models.Day || model<DayType>('Day', daySchema);
      const fetchedDays: DayType[] = JSON.parse(JSON.stringify(await Day.find().lean()));
      return fetchedDays;
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
    }
}
  
export const addPersonToDay = async (dayId: ObjectId | string, person: string) => {
    try {
      const mongoose = await connectToDatabase();
      const Day = mongoose!.models.Day || model<DayType>('Day', daySchema);
      await Day.updateOne({ _id: dayId }, { $push: { bookings: person } });
    } catch (error) {
      console.error('Error adding person to day:', error);
    }
}

export const addPersonToNewDay = async (date: Date, capacity: number) => {
    try {
      const mongoose = await connectToDatabase();
      const Day = mongoose!.models.Day || model<DayType>('Day', daySchema);
      const newDay = new Day({ date, capacity });
      await newDay.save();
    } catch (error) {
      console.error('Error adding person to day:', error);
    }
}