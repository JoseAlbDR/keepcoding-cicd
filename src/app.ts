import { envs } from './config';
import { MongoDatabase } from './data/mongo/mongo-connection';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

(async () => {
  await main();
})();

async function main() {
  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
    publicPath: envs.PUBLIC_FOLDER,
    productsImagePath: envs.UPLOADS_FOLDER,
  });

  server.start();
}
