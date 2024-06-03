import express, { Express } from 'express';
import { start } from '@auth/server';
import { databaseConnection } from '@auth/database';
import 'express-async-errors';

import { config } from './config';

const initialize = (): void => {
  config.cloudinaryConfig();
  const app: Express = express();
  databaseConnection();
  start(app);
};

initialize();