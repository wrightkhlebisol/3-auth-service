import client, { Channel, Connection } from 'amqplib';
import { config } from '@auth/config';
import { winstonLogger } from '@wrightkhlebisol/jobber-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'auth-queue-connection',
  'debug',
);

async function createConnectionAndChannel(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(
      `${config.RABBITMQ_ENDPOINT}`,
    );
    // Virtual connection inside the main rabbitmq connection
    const queueChannel: Channel = await connection.createChannel();
    log.info('AuthService connected to RabbitMQ');
    closeConnection(connection, queueChannel);
    return queueChannel;
  } catch (error) {
    log.log(
      'error',
      'AuthService createConnectionAndChannel() method',
      error,
    );
    return undefined;
  }
}

function closeConnection(connection: Connection, queueChannel: Channel): void {
  process.on('SIGINT', async () => {
    log.info('AuthService: closing channel...');
    await queueChannel.close();
    log.info('AuthService: closing connection...');
    await connection.close();
    log.info('AuthService disconnected from RabbitMQ');
    process.exit(0);
  });
}

export { createConnectionAndChannel };
