import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@auth/config';
import { winstonLogger } from '@wrightkhlebisol/jobber-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'auth-elastic-search-server',
  'debug',
);

export const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`,
});

export async function checkConnection(): Promise<void> {
  let isConnected = false;

  while (!isConnected) {
    log.info('AuthService connecting to ElasticSearch...');
    try {
      const health: ClusterHealthResponse =
        await elasticSearchClient.cluster.health({});
      log.info(
        `AuthService Elasticsearch health status - ${health.status}`,
      );
      isConnected = true;
    } catch (error) {
      log.error('Connection to ElasticSearch failed, retrying...', error);
      log.log(
        'error',
        'AuthService ElasticSearch checkConnection() method',
        error,
      );
    }
  }
}
