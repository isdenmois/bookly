import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';
import { to2 } from './to-2';
import { to3 } from './to-3';

export const migrations = schemaMigrations({
  migrations: [to2, to3],
});
