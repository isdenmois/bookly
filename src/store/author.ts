import _ from 'lodash';
import { Model, Q } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

type AuthorFields = 'id' | 'name';

export type AuthorData = Pick<Author, AuthorFields>;

export default class Author extends Model {
  static table = 'authors';
  static associations: any = {
    book_authors: { type: 'has_many', foreignKey: 'author_id' },
    books: { type: 'belongs_to', key: 'book_id', table: 'book_authors' },
  };

  @field('name') name;
  // @lazy books = this.collections.get('books').query(Q.on('book_authors', 'author_id', this.id));
}

export async function prepareMissedAuthors(database, authors) {
  if (!authors || !authors.length) {
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

function findExistsAuthors(collection, authors) {
  return collection
    .query(authorsQuery(authors))
    .fetch()
    .then(exists => exists.map(a => a.id));
}

function authorsQuery(authors) {
  return Q.where('id', Q.oneOf(authors.map(a => a.id)));
}
