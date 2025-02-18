import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Task } from './entities/task.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'task_management_db',
  entities: [User, Task],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
});
