import React from 'react';
import { Text, View, ViewStyle, TextStyle, Linking, ToastAndroid, Clipboard, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import { NavigationStackProp } from 'react-navigation-stack';
import { dynamicColor } from 'types/colors';
import { formatDate } from 'utils/date';
import Book from 'store/book';
import { hasUpdates } from 'utils/has-updates';
import { BookExtended, ParentBook, Film } from 'types/book-extended';
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
import { withScroll } from './tab';
import { t } from 'services';
import { DynamicStyleSheet } from 'react-native-dynamic';
import { openInTelegram } from 'screens/book-select/book-selector';

interface Props {
  navigation: NavigationStackProp;
  book: Book & BookExtended;
  isExist: boolean;
  tab: string;
  mode: string;
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
  'mode',
];

@withScroll
export class DetailsTab extends React.Component<Props> {
  shouldComponentUpdate(props, state) {
    return hasUpdates(this, props, state, paths);
  }

  get readDate() {
    const book = this.props.book;
    const parts = [
      formatDate(book.date),
      book.audio && t('common.audiobook'),
      book.withoutTranslation && t('common.original'),
    ];

    return parts
      .filter(p => p)
      .join(', ')
      .toLowerCase();
  }

  render() {
    const { book, isExist } = this.props;
    const all = this.props.tab !== 'main';
    const isLivelib = typeof book.id === 'string' && book.id.startsWith('l_');
    const hasPaper = book.paper;
    const isRead = book.status === BOOK_STATUSES.READ;
    const mode = this.props.mode;
    const otherTitles = _.split(book.otherTitles, TITLE_SEPARATOR)
      .filter(t => t !== book.title)
      .join('\n');

    return (
      <View>
        {all && <ViewLine title='ID' value={book.id} mode={mode} />}
        {all && <ViewLine title={t('details.type')} value={BOOK_TYPE_NAMES[book.type]} mode={mode} />}

        {!all && !book.thumbnail && !!book.genre && (
          <ViewLine title={t('details.genre')} value={book.genre} mode={mode} />
        )}

        {(all || !book.thumbnail) && !!book.avgRating && (
          <ViewLine title={t('details.average')} value={book.avgRating} mode={mode} />
        )}

        {(all || !book.thumbnail) && !!book.year && <ViewLine title={t('year')} value={book.year} mode={mode} />}

        {this.renderTranslators()}

        {isRead && <ViewLine title={t('details.read-date')} value={this.readDate} mode={mode} />}

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

        {all && !!book.description && <BookDescriptionLine description={book.description} mode={mode} />}

        {!!book.parent?.length && this.renderParentBooks()}

        {!!book.films?.length && this.renderFilms()}

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

  openBook(book: Book | ParentBook) {
    this.props.navigation.push('Details', { bookId: String(book.id) });
  }

  openEditions = () => {
    const { editionIds, editionTranslators } = this.props.book;

    this.props.navigation.push('Editions', { editionIds, translators: editionTranslators });
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

    this.props.navigation.push('/modal/thumbnail-select', { book: this.props.book });
  };

  openEditModal = () => {
    this.props.navigation.push('/modal/book-title-edit', { book: this.props.book });
  };

  searchInLivelib = () => this.searchInLivelibAction(false);
  forceSearchInLivelib = () => this.searchInLivelibAction(true);

  searchInLivelibAction(forceOpen?: boolean) {
    const book = this.props.book;

    this.props.navigation.push('Search', { query: book.title, source: livelib, forceOpen, fantlabId: book.id });
  }

  togglePaper = () => {
    const book = this.props.book;

    book.setData({ paper: !book.paper });
  };

  toggleLeave = () => {
    const book = this.props.book;

    book.setData({ leave: !book.leave });
  };
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
