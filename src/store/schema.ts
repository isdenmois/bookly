import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'books',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'author', type: 'string' },
        { name: 'status', type: 'string', isIndexed: true },
        { name: 'thumbnail', type: 'string', isOptional: true },
        { name: 'rating', type: 'number', isOptional: true },
        { name: 'date', type: 'number', isOptional: true, isIndexed: true },
        { name: 'type', type: 'string', isOptional: true },
        { name: 'searchTitles', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'authors',
      columns: [{ name: 'name', type: 'string' }],
    }),
    tableSchema({
      name: 'book_authors',
      columns: [
        { name: 'book_id', type: 'string', isIndexed: true },
        { name: 'author_id', type: 'string', isIndexed: true },
      ],
    }),
  ],
});