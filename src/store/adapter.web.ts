import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';

import { migrations } from './migrations';
import { schema } from './schema';

export const adapter = new LokiJSAdapter({ schema, migrations, useWebWorker: true, useIncrementalIndexedDB: true });
