import { SnakeCaseStrategy } from './naming.strategy';

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/**/*.subscribers.ts'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src',
  },
  namingStrategy: new SnakeCaseStrategy(),
};
