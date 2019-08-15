import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'
import { to2 } from './to-2'

export const migrations = schemaMigrations({
  migrations: [
    to2
  ],
})
