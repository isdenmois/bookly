import React from 'react';
import { Text, View, ViewStyle, TextStyle, Linking, ToastAndroid, Clipboard, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import { dynamicColor } from 'types/colors';
import { formatDate } from 'utils/date';
import Book, { Read } from 'store/book';
import { hasUpdates } from 'utils/has-updates';
import { BookExtended, ParentBook, Film } from 'types/book-extended';
import { LiveLibBook } from 'services/api/livelib/book';
import { BOOK_TYPE_NAMES } from 'types/book-types';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { livelib } from 'screens/search/search.screen';
import {
  BookDescriptionLine,
  ViewLine,
  ViewLineTouchable,
  ViewLineModelRemove,
  ViewLineAction,
} from './book-details-lines';
import { BookLists } from './book-lists';
import { t, database, openModal, getNavigation } from 'services';
import { DarkModeContext, DynamicStyleSheet } from 'react-native-dynamic';
import { openInTelegram } from 'screens/book-select/book-selector';
import { thousandsSeparator } from 'utils/number-format';
import { MainRoutes, ModalRoutes } from 'navigation/routes';

interface Props {
  book: Book & BookExtended & LiveLibBook;
  isExist: boolean;
  fantlabId: string;
  tab: string;
}

const TITLE_SEPARATOR = /\s*;\s*/g;
const paths = [
  'book',
  'book.paper',
  'book.status',
  'book.thumbnail',
  'book.leave',
  'book.audio',
  'book.withoutTranslation',
];

export class DetailsTab extends React.Component<Props> {
  static contextType = DarkModeContext;
  shouldComponentUpdate(props, state) {
    return hasUpdates(this, props, state, paths);
  }

  get allReads() {
    const book = this.props.book;

    return [book as Read].concat(this.props.book.reads).map(formatReadDate).join('\n');
  }

  render() {
    const { book, fantlabId, isExist } = this.props;
    const isLivelib = typeof book.id === 'string' && book.id.startsWith('l_');
    const all = isLivelib || this.props.tab !== 'main';
    const notLL = !all && !isLivelib;
    const hasPaper = book.paper;
    const isRead = book.status === BOOK_STATUSES.READ;
    const otherTitles = _.split(book.otherTitles, TITLE_SEPARATOR)
      .filter(t => t !== book.title)
      .join('\n');
    const showLists = isExist && book.status === BOOK_STATUSES.WISH;

    return (
      <View style={ds.dark.container}>
        {isRead && <ViewLine title={t('details.read-date')} value={this.allReads} />}

        {!isExist && fantlabId && <ViewLineAction title='Ассоциировать книгу' onPress={this.associate} />}

        {notLL && <ViewLine title='ID' value={book.id} />}
        {notLL && <ViewLine title={t('details.type')} value={BOOK_TYPE_NAMES[book.type]} />}

        {!all && !book.thumbnail && !!book.genre && <ViewLine title={t('details.genre')} value={book.genre} />}

        {!!book.avgRating && this.renderAvgRating()}

        {notLL && !!book.year && <ViewLine title={t('year')} value={book.year} />}

        {this.renderTranslators()}

        {!!book.editionCount && (
          <ViewLineTouchable
            title={t('details.editions')}
            value={book.editionCount}
            onPress={this.openEditions}
            onLongPress={this.openChangeThumbnail}
          />
        )}
        {!book.editionCount && !!book.lid && (
          <ViewLineTouchable
            title={t('details.thumbnail')}
            value={t('details.livelib')}
            onPress={this.openChangeThumbnail}
          />
        )}

        {!!book.language && <ViewLine title={t('details.language')} value={book.language} />}
        {!!book.title && !!book.originalTitle && (
          <ViewLineTouchable
            title={t('details.original-title')}
            value={book.originalTitle}
            onPress={this.openTelegram}
            onLongPress={this.copyBookOriginalTitle}
          />
        )}

        {!!otherTitles && <ViewLine title={t('details.other-titles')} value={otherTitles} />}

        {all && book.classification?.length > 0 && this.renderClassification()}

        {!!book.series && <ViewLine title='Серия' value={book.series} />}
        {!!book.isbn && <ViewLine title='ISBN' value={book.isbn} />}
        {!!book.tags && <ViewLine title='Теги' value={book.tags} />}
        {!!book.cycles?.length && this.renderCycles()}

        {all && !!book.description && <BookDescriptionLine description={book.description} />}

        {!!book.parent?.length && this.renderParentBooks()}

        {!!book.films?.length && this.renderFilms()}

        {showLists && <BookLists book={book} />}

        {all && !isLivelib && (
          <ViewLineAction
            title={t('details.find-ll')}
            onPress={this.forceSearchInLivelib}
            onLongPress={this.searchInLivelib}
          />
        )}

        {all && isExist && <ViewLineAction title={t('details.edit')} onPress={this.openEditModal} />}

        {all && isExist && (
          <ViewLineAction
            title={t(hasPaper ? 'details.has-paper' : 'details.has-no-paper')}
            onPress={this.togglePaper}
          />
        )}

        {all && isExist && isRead && hasPaper && (
          <ViewLineAction title={t(book.leave ? 'details.leave' : 'details.keep')} onPress={this.toggleLeave} />
        )}

        {all && isExist && <ViewLineModelRemove model={book} warning={t('details.delete')} />}
      </View>
    );
  }

  renderAvgRating() {
    const { book } = this.props;
    const voters = book.voters;
    const rating = voters ? `${book.avgRating} (${thousandsSeparator(voters)})` : book.avgRating;

    return <ViewLine title={t('details.average')} value={rating} />;
  }

  renderTranslators() {
    const translators = this.props.book.translators;

    if (!translators?.length) {
      return null;
    }

    const title = t(translators.length > 1 ? 'details.translators' : 'details.translator');

    return <ViewLine title={title} value={translators.join('\n')} />;
  }

  renderClassification() {
    const s = ds[this.context];

    return _.map(this.props.book.classification, detail => (
      <View key={detail.id} style={s.classification}>
        <Text style={s.title}>{detail.title}</Text>

        {detail.genres.map(g => (
          <TouchableOpacity key={g.id} onPress={() => this.openGenre(g.ids)} style={s.value}>
            <Text style={s.value}>{g.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ));
  }

  renderParentBooks() {
    const s = ds[this.context];

    return (
      <View style={s.parentBooks}>
        <Text style={s.header}>{t('details.series')}</Text>

        {this.props.book.parent.map(book => (
          <ViewLineTouchable key={book.id} onPress={() => this.openBook(book)} title={book.type} value={book.title} />
        ))}
      </View>
    );
  }

  renderFilms() {
    const s = ds[this.context];

    return (
      <View style={s.parentBooks}>
        <Text style={s.header}>{t('details.films')}</Text>

        {this.props.book.films.map(f => this.renderFilm(f))}
      </View>
    );
  }

  renderFilm(film: Film) {
    const value = film.country ? `${film.title} (${film.country})` : film.title;

    return <ViewLine key={film.id} title={film.year} value={value} />;
  }

  renderCycles() {
    const mode = this.context;
    const s = ds[mode];

    return (
      <View style={s.parentBooks}>
        <Text style={s.header}>ВХОДИТ В</Text>

        {this.props.book.cycles.map(book => (
          <ViewLine key={book.id} title={book.type} value={book.title} />
        ))}
      </View>
    );
  }

  openBook(book: Book | ParentBook) {
    getNavigation().push(MainRoutes.Details, { bookId: String(book.id), initialTab: 'children' });
  }

  openEditions = () => {
    const { editionIds, editionTranslators } = this.props.book;

    getNavigation().push(MainRoutes.Editions, { editionIds, translators: editionTranslators });
  };

  openTelegram = () => openInTelegram(this.props.book.originalTitle);

  openGenre = (ids: number[]) => Linking.openURL(`https://fantlab.ru/bygenre?${ids.map(i => `wg${i}=on`).join('&')}`);

  copyBookOriginalTitle = () => {
    Clipboard.setString(this.props.book.originalTitle);
    ToastAndroid.show(t('details.copied'), ToastAndroid.SHORT);
  };

  openChangeThumbnail = () => {
    if (!this.props.isExist) {
      return ToastAndroid.show(t('details.should-add'), ToastAndroid.SHORT);
    }

    openModal(ModalRoutes.ThumbnailSelect, { book: this.props.book });
  };

  openEditModal = () => {
    openModal(ModalRoutes.BookTitleEdit, { book: this.props.book });
  };

  searchInLivelib = () => this.searchInLivelibAction(false);
  forceSearchInLivelib = () => this.searchInLivelibAction(true);

  searchInLivelibAction(forceOpen?: boolean) {
    const book = this.props.book;

    getNavigation().push(MainRoutes.Search, {
      query: book.title,
      source: livelib,
      forceOpen,
      fantlabId: book.id,
    });
  }

  togglePaper = () => {
    const book = this.props.book;

    book.setData({ paper: !book.paper });
  };

  toggleLeave = () => {
    const book = this.props.book;

    book.setData({ leave: !book.leave });
  };

  associate = async () => {
    const book: Book = (await database.collections.get('books').find(this.props.fantlabId)) as any;

    await book.setData({ lid: this.props.book.id.replace('l_', '') });

    ToastAndroid.show('Ассоциировано', ToastAndroid.SHORT);

    getNavigation().goBack();
  };
}

function formatReadDate(read: Read) {
  const parts = [
    formatDate(read.date),
    'status' in read ? null : `${read.rating} / 10`,
    read.audio && t('common.audiobook'),
    read.withoutTranslation && t('common.original'),
  ];

  return parts
    .filter(p => p)
    .join(', ')
    .toLowerCase();
}

const ds = new DynamicStyleSheet({
  container: {
    padding: 16,
  },
  header: {
    color: dynamicColor.SecondaryText,
    fontSize: 14,
    marginBottom: 10,
  } as TextStyle,
  parentBooks: {
    marginTop: 10,
  } as ViewStyle,
  classification: {
    marginBottom: 20,
  } as ViewStyle,
  title: {
    color: dynamicColor.SecondaryText,
    fontSize: 12,
  } as TextStyle,
  value: {
    color: dynamicColor.PrimaryText,
    fontSize: 18,
  } as TextStyle,
});
