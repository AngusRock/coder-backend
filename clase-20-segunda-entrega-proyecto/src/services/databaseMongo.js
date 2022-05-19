import mongoose from 'mongoose';

const connectionString = process.env.MONGO_ATLAS_SRV
console.log('atlas',connectionString);

export const initMongoDB = async () => {
  try {
    console.log('CONECTANDO A LA DB');
    console.log(connectionString)
    await mongoose.connect(connectionString);

    console.log('CONEXION EXITOSA');
  } catch (error) {
    console.log(`ERROR => ${error}`);
    return error;
  }
};