import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connString = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pokeapi_db';
    const conn = await mongoose.connect(connString, { serverSelectionTimeoutMS: 2000 });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Local MongoDB service not detected (${(error as Error).message}).`);
    console.log(`🚀 Falling back to In-Memory MongoDB Server for zero-setup execution...`);

    try {
      // Dynamic import of MongoMemoryServer
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`🍃 MongoDB In-Memory Server Started & Connected at: ${conn.connection.host}`);
    } catch (fallbackError) {
      console.error(`❌ Could not start MongoDB fallback: ${(fallbackError as Error).message}`);
      console.warn(`💡 Tip: Install/Start MongoDB locally or set MONGODB_URI to a MongoDB Atlas cluster URI in backend/.env`);
    }
  }
};
