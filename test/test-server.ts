import { envs } from '../src/config';
import { Server } from '../src/presentation/server';
import { AppRoutes } from '../src/presentation/routes';

export const testServer = new Server({
  port: envs.PORT,
  productsImagePath: envs.UPLOADS_FOLDER,
  publicPath: envs.PUBLIC_FOLDER,
  routes: AppRoutes.routes,
});
