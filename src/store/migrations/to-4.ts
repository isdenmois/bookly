import { addColumns } from '@nozbe/watermelondb/Schema/migrations';

export const to4 = {
  toVersion: 4,
  steps: [
    addColumns({
      table: 'books',
      columns: [
        { name: 'without_translation', type: 'boolean' },
        { name: 'audio', type: 'boolean' },
      ],
    }),
  ],
};
