import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),

  MONGO_URL: get('MONGO_URL').required().asString(),
  MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),

  JWT_SEED: get('JWT_SEED').required().asString(),

  PUBLIC_FOLDER: get('PUBLIC_FOLDER').default('public').asString(),
  UPLOADS_FOLDER: get('UPLOADS_FOLDER').default('uploads').asString(),

  STAGE: get('STAGE').required().asEnum(['development', 'production', 'test']),
};
