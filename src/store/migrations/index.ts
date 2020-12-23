import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';
import { addColumns, createTable } from '@nozbe/watermelondb/Schema/migrations';

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: 'books',
          columns: [{ name: 'created_at', type: 'number' }],
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        addColumns({
          table: 'books',
          columns: [
            { name: 'lid', type: 'string' },
            { name: 'paper', type: 'boolean' },
          ],
        }),
      ],
    },
    {
      toVersion: 4,
      steps: [
        addColumns({
          table: 'books',
          columns: [
            { name: 'without_translation', type: 'boolean', isOptional: true },
            { name: 'audio', type: 'boolean', isOptional: true },
            { name: 'leave', type: 'boolean', isOptional: true },
          ],
        }),
      ],
    },
    {
      toVersion: 5,
      steps: [
        addColumns({
          table: 'authors',
          columns: [
            { name: 'fav', type: 'boolean', isOptional: true },
            { name: 'add', type: 'string', isOptional: true },
          ],
        }),
      ],
    },
    {
      toVersion: 6,
      steps: [
        createTable({
          name: 'lists',
          columns: [{ name: 'name', type: 'string' }],
        }),
        createTable({
          name: 'list_books',
          columns: [
            { name: 'book_id', type: 'string', isIndexed: true },
            { name: 'list_id', type: 'string', isIndexed: true },
          ],
        }),
      ],
    },
    {
      toVersion: 7,
      steps: [
        addColumns({
          table: 'books',
          columns: [{ name: 'updated_at', type: 'number' }],
        }),
      ],
    },
    {
      toVersion: 8,
      steps: [
        addColumns({
          table: 'books',
          columns: [{ name: 'reads', type: 'string', isOptional: true }],
        }),
      ],
    },
  ],
});
