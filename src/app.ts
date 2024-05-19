import express, { Express } from 'express';
import { start } from '@auth/server';
import { databaseConnection } from '@auth/database';

const initialize = (): void => {
  const app: Express = express();
  databaseConnection();
  start(app);
};

initialize();