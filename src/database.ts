import { winstonLogger } from '@wrightkhlebisol/jobber-shared';
import { Logger } from 'winston';
import { config } from '@auth/config';
import { Sequelize } from 'sequelize';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authDatabaseServer', 'debug');

export const sequelize = new Sequelize(config.MYSQL_HOST!, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    multipleStatements: true
  },
});

export async function databaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    log.info('Auth Service - MySQL Connection has been established successfully.');
  } catch (error) {
    log.error('Auth Service - Error connecting to the database');
    log.log('error', 'Authservice databaseConnection() method error:', error);
  }
}