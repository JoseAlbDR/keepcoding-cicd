import mongoose from 'mongoose';

interface ConnectionOptions {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {
  static async connect(options: ConnectionOptions) {
    const { mongoUrl, dbName } = options;

    try {
      await mongoose.connect(mongoUrl, { dbName });
      console.log(`Connected to database: ${dbName}`);
      return true;
    } catch (error) {
      console.log('Mongo connection error');
      throw error;
    }
  }

  static async disconnect() {
    try {
      console.log('Database disconnected');
      await mongoose.disconnect();
    } catch (error) {
      console.log('Mongo disconnect error');
      throw error;
    }
  }
}
