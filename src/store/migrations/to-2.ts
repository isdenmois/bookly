import { addColumns } from '@nozbe/watermelondb/Schema/migrations';

export const to2 = {
  toVersion: 2,
  steps: [
    addColumns({
      table: 'books',
      columns: [{ name: 'created_at', type: 'number' }],
    }),
  ],
};
