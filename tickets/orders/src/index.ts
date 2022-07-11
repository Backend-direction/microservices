import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if(!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('Mongo uri should be defined')
  }
  
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('Nats client id should be defined')
  }
  
  if (!process.env.NATS_URL) {
    throw new Error('Nats uri should be defined')
  }
  
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('Nats cluster id should be defined')
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
  } catch(e) {
    console.log(e);
  }

  app.listen(3000, () => {
    console.log('Tickets on port 3000');
  });
}


start();
