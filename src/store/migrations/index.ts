import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';
import { to2 } from './to-2';
import { to3 } from './to-3';
import { to4 } from './to-4';
import { to5 } from './to-5';

export const migrations = schemaMigrations({
  migrations: [to2, to3, to4, to5],
});
