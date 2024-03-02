import { envs } from '../src/config';
import { MongoDatabase } from '../src/data';

export class TestDatabase {
  static async start() {
    await MongoDatabase.connect({
      dbName: envs.MONGO_DB_NAME,
      mongoUrl: envs.MONGO_URL,
    });
  }

  static close() {
    MongoDatabase.disconnect();
  }
}
