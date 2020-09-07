import { Model, Q } from '@nozbe/watermelondb';
import { field, lazy, action } from '@nozbe/watermelondb/decorators';

type ListFields = 'id' | 'name';

export type ListData = Pick<List, ListFields>;

export default class List extends Model {
  static table = 'lists';
  static associations: any = {
    list_books: { type: 'has_many', foreignKey: 'list_id' },
  };

  @field('name') name: string;
  @lazy books = this.collections.get('books').query(Q.on('list_books', 'list_id', this.id));

  @action setName(name: string) {
    return this.update(() => {
      this.name = name;
    });
  }
}

export function createList(database, name: string) {
  const lists = database.collections.get('lists');

  return database.action(() =>
    lists.create(list => {
      list.name = name;
    }),
  );
}
