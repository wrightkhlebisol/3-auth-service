import { Application } from 'express';

export function appRoutes(app: Application): void {
  app.use('', () => console.log('appRoutes'));
}