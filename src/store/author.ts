import _ from 'lodash';
import { Model, Q } from '@nozbe/watermelondb';
import { field, action } from '@nozbe/watermelondb/decorators';

type AuthorFields = 'id' | 'name';

export type AuthorData = Pick<Author, AuthorFields>;

export default class Author extends Model {
  static table = 'authors';
  static associations: any = {
    book_authors: { type: 'has_many', foreignKey: 'author_id' },
  };

  @field('name') name: string;
  @field('fav') fav: boolean;
  @field('add') add: string;
  // @lazy books = this.collections.get('books').query(Q.on('book_authors', 'author_id', this.id));

  @action setFav(fav: boolean, add: string) {
    return this.update(() => {
      this.fav = fav;
      this.add = fav ? add : null;
    });
  }
}

export async function prepareMissedAuthors(database, authors) {
  if (!authors?.length) {
    return [];
  }

  const authorsCollection = database.collections.get('authors');
  const exists = await findExistsAuthors(authorsCollection, authors);

  return _.map(authors, author => {
    if (exists.includes(author.id)) {
      return null;
    }

    return authorsCollection.prepareCreate(a => {
      a._raw.id = author.id;
      a.name = author.name;
    });
  }).filter(_.identity);
}

export function createAuthor(db, data) {
  return db.action(() =>
    db.collections.get('authors').create(a => {
      const { id, ...rest } = data;
      a._raw.id = id;
      Object.assign(a, rest);
    }),
  );
}

function findExistsAuthors(collection, authors) {
  return collection
    .query(authorsQuery(authors))
    .fetch()
    .then(exists => exists.map(a => a.id));
}

function authorsQuery(authors) {
  return Q.where('id', Q.oneOf(authors.map(a => a.id)));
}
