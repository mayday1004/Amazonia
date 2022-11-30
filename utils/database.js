import mongoose from 'mongoose';

export const connectToDatabase = () => {
  const client = mongoose
    .connect(process.env.DATABASE)
    .then(() => console.log('DB connection successful! 😎'))
    .catch(err => {
      if (process.env.NODE_ENV !== 'development') {
        console.error('DB connection failed! 😭');
      } else {
        console.error(err);
      }
      mongoose.disconnect();
    });

  mongoose.set('strictQuery', false);
  return client;
};

export const disconnectDatabase = async () => {
  if (process.env.NODE_ENV === 'production') {
    await mongoose.disconnect();
  }
};

export const convertDocToObj = doc => {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
};
