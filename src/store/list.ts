import { Model } from '@nozbe/watermelondb';
import { field, action, children } from '@nozbe/watermelondb/decorators';

type ListFields = 'id' | 'name';

export type ListData = Pick<List, ListFields>;

export default class List extends Model {
  static table = 'lists';
  static associations: any = {
    list_books: { type: 'has_many', foreignKey: 'list_id' },
  };

  @field('name') name: string;
  // @lazy books = this.collections.get('books').query(Q.on('list_books', 'list_id', this.id));
  @children('list_books') lists;

  @action setName(name: string) {
    return this.update(() => {
      this.name = name;
    });
  }

  async markAsDeleted() {
    await this.lists.markAllAsDeleted();
    await super.markAsDeleted();
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
