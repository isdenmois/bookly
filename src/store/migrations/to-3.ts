import { addColumns } from '@nozbe/watermelondb/Schema/migrations';

export const to3 = {
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
};
