import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 8,
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
        { name: 'search', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'lid', type: 'string', isOptional: true },
        { name: 'paper', type: 'boolean', isOptional: true },
        { name: 'without_translation', type: 'boolean', isOptional: true },
        { name: 'audio', type: 'boolean', isOptional: true },
        { name: 'leave', type: 'boolean', isOptional: true },
        { name: 'reads', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'authors',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'fav', type: 'boolean', isOptional: true },
        { name: 'add', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'book_authors',
      columns: [
        { name: 'book_id', type: 'string', isIndexed: true },
        { name: 'author_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'reviews',
      columns: [
        { name: 'book_id', type: 'string', isIndexed: true },
        { name: 'date', type: 'number' },
        { name: 'body', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'lists',
      columns: [{ name: 'name', type: 'string' }],
    }),
    tableSchema({
      name: 'list_books',
      columns: [
        { name: 'book_id', type: 'string', isIndexed: true },
        { name: 'list_id', type: 'string', isIndexed: true },
      ],
    }),
  ],
});
