import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  if(!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('Mongo uri should be defined')
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch(e) {
    console.log(e);
  }

  app.listen(3000, () => {
    console.log('Tickets on port 3000');
  });
}


start();
