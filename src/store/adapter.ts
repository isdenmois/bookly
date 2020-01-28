import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { migrations } from './migrations';
import { schema } from './schema';

export const adapter = new SQLiteAdapter({ dbName: 'books', schema, migrations });
