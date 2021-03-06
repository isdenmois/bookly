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
} from '../components/book-details-lines';
import { BookLists } from '../components/book-lists';
import { withScroll } from './tab';
import { t, database, openModal } from 'services';
import { DynamicStyleSheet } from 'react-native-dynamic';
import { openInTelegram } from 'screens/book-select/book-selector';
import { thousandsSeparator } from 'utils/number-format';
import { MainRoutes, MainScreenProps, ModalRoutes } from 'navigation/routes';

type Props = MainScreenProps<MainRoutes.Details> & {
  book: Book & BookExtended & LiveLibBook;
  isExist: boolean;
  fantlabId: string;
  tab: string;
  mode: string;
};

const TITLE_SEPARATOR = /\s*;\s*/g;
const paths = [
  'book',
  'book.paper',
  'book.status',
  'book.thumbnail',
  'book.leave',
  'book.audio',
  'book.withoutTranslation',
  'mode',
];

@withScroll
export class DetailsTab extends React.Component<Props> {
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
    const mode = this.props.mode;
    const otherTitles = _.split(book.otherTitles, TITLE_SEPARATOR)
      .filter(t => t !== book.title)
      .join('\n');
    const showLists = isExist && book.status === BOOK_STATUSES.WISH;

    return (
      <View>
        {isRead && <ViewLine title={t('details.read-date')} value={this.allReads} mode={mode} />}

        {!isExist && fantlabId && <ViewLineAction title='Ассоциировать книгу' onPress={this.associate} mode={mode} />}

        {notLL && <ViewLine title='ID' value={book.id} mode={mode} />}
        {notLL && <ViewLine title={t('details.type')} value={BOOK_TYPE_NAMES[book.type]} mode={mode} />}

        {!all && !book.thumbnail && !!book.genre && (
          <ViewLine title={t('details.genre')} value={book.genre} mode={mode} />
        )}

        {!!book.avgRating && this.renderAvgRating()}

        {notLL && !!book.year && <ViewLine title={t('year')} value={book.year} mode={mode} />}

        {this.renderTranslators()}

        {!!book.editionCount && (
          <ViewLineTouchable
            title={t('details.editions')}
            value={book.editionCount}
            mode={mode}
            onPress={this.openEditions}
            onLongPress={this.openChangeThumbnail}
          />
        )}
        {!book.editionCount && !!book.lid && (
          <ViewLineTouchable
            title={t('details.thumbnail')}
            value={t('details.livelib')}
            mode={mode}
            onPress={this.openChangeThumbnail}
          />
        )}

        {!!book.language && <ViewLine title={t('details.language')} value={book.language} mode={mode} />}
        {!!book.title && !!book.originalTitle && (
          <ViewLineTouchable
            title={t('details.original-title')}
            value={book.originalTitle}
            mode={mode}
            onPress={this.openTelegram}
            onLongPress={this.copyBookOriginalTitle}
          />
        )}

        {!!otherTitles && <ViewLine title={t('details.other-titles')} value={otherTitles} mode={mode} />}

        {all && book.classification?.length > 0 && this.renderClassification()}

        {!!book.series && <ViewLine title='Серия' value={book.series} mode={mode} />}
        {!!book.isbn && <ViewLine title='ISBN' value={book.isbn} mode={mode} />}
        {!!book.tags && <ViewLine title='Теги' value={book.tags} mode={mode} />}
        {!!book.cycles?.length && this.renderCycles()}

        {all && !!book.description && <BookDescriptionLine description={book.description} mode={mode} />}

        {!!book.parent?.length && this.renderParentBooks()}

        {!!book.films?.length && this.renderFilms()}

        {showLists && <BookLists book={book} mode={mode} />}

        {all && !isLivelib && (
          <ViewLineAction
            title={t('details.find-ll')}
            mode={mode}
            onPress={this.forceSearchInLivelib}
            onLongPress={this.searchInLivelib}
          />
        )}

        {all && isExist && <ViewLineAction title={t('details.edit')} onPress={this.openEditModal} mode={mode} />}

        {all && isExist && (
          <ViewLineAction
            mode={mode}
            title={t(hasPaper ? 'details.has-paper' : 'details.has-no-paper')}
            onPress={this.togglePaper}
          />
        )}

        {all && isExist && isRead && hasPaper && (
          <ViewLineAction
            title={t(book.leave ? 'details.leave' : 'details.keep')}
            onPress={this.toggleLeave}
            mode={mode}
          />
        )}

        {all && isExist && <ViewLineModelRemove model={book} warning={t('details.delete')} mode={mode} />}
      </View>
    );
  }

  renderAvgRating() {
    const { book, mode } = this.props;
    const voters = book.voters;
    const rating = voters ? `${book.avgRating} (${thousandsSeparator(voters)})` : book.avgRating;

    return <ViewLine title={t('details.average')} value={rating} mode={mode} />;
  }

  renderTranslators() {
    const translators = this.props.book.translators;

    if (!translators?.length) {
      return null;
    }

    const title = t(translators.length > 1 ? 'details.translators' : 'details.translator');

    return <ViewLine title={title} value={translators.join('\n')} mode={this.props.mode} />;
  }

  renderClassification() {
    const s = ds[this.props.mode];

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
    const s = ds[this.props.mode];

    return (
      <View style={s.parentBooks}>
        <Text style={s.header}>{t('details.series')}</Text>

        {this.props.book.parent.map(book => (
          <ViewLineTouchable
            key={book.id}
            onPress={() => this.openBook(book)}
            title={book.type}
            value={book.title}
            mode={this.props.mode}
          />
        ))}
      </View>
    );
  }

  renderFilms() {
    const s = ds[this.props.mode];

    return (
      <View style={s.parentBooks}>
        <Text style={s.header}>{t('details.films')}</Text>

        {this.props.book.films.map(f => this.renderFilm(f))}
      </View>
    );
  }

  renderFilm(film: Film) {
    const value = film.country ? `${film.title} (${film.country})` : film.title;

    return <ViewLine key={film.id} title={film.year} value={value} mode={this.props.mode} />;
  }

  renderCycles() {
    const mode = this.props.mode;
    const s = ds[mode];

    return (
      <View style={s.parentBooks}>
        <Text style={s.header}>ВХОДИТ В</Text>

        {this.props.book.cycles.map(book => (
          <ViewLine key={book.id} title={book.type} value={book.title} mode={mode} />
        ))}
      </View>
    );
  }

  openBook(book: Book | ParentBook) {
    this.props.navigation.push(MainRoutes.Details, { bookId: String(book.id), initialTab: 'children' });
  }

  openEditions = () => {
    const { editionIds, editionTranslators } = this.props.book;

    this.props.navigation.push(MainRoutes.Editions, { editionIds, translators: editionTranslators });
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

    this.props.navigation.push(MainRoutes.Search, {
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

    this.props.navigation.goBack();
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
