import { addColumns } from '@nozbe/watermelondb/Schema/migrations';

export const to5 = {
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
};
