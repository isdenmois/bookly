import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Linking,
  ToastAndroid,
  Clipboard,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import { NavigationStackProp } from 'react-navigation-stack';
import { color } from 'types/colors';
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

interface Props {
  navigation: NavigationStackProp;
  book: Book & BookExtended;
  isExist: boolean;
  tab: string;
}

const TITLE_SEPARATOR = /\s*;\s*/g;
const paths = ['book', 'book.paper', 'book.status', 'book.thumbnail'];

@withScroll
export class DetailsTab extends React.Component<Props> {
  shouldComponentUpdate(props, state) {
    return hasUpdates(this, props, state, paths);
  }

  render() {
    const { book, isExist } = this.props;
    const all = this.props.tab !== 'main';
    const isLivelib = typeof book.id === 'string' && book.id.startsWith('l_');
    const hasPaper = book.paper;
    const otherTitles = _.split(book.otherTitles, TITLE_SEPARATOR)
      .filter(t => t !== book.title)
      .join('\n');

    return (
      <View>
        {all && <ViewLine title='ID' value={book.id} />}
        {all && <ViewLine title='Тип' value={BOOK_TYPE_NAMES[book.type]} />}

        {!all && !book.thumbnail && !!book.genre && <ViewLine title='Жанр' value={book.genre} />}
        {(all || !book.thumbnail) && !!book.year && <ViewLine title='Год' value={book.year} />}

        {this.renderTranslators()}

        {book.status === BOOK_STATUSES.READ && <ViewLine title='Дата прочтения' value={formatDate(book.date)} />}

        {!!book.editionCount && (
          <ViewLineTouchable
            title='Изданий'
            value={book.editionCount}
            onPress={this.openEditions}
            onLongPress={this.openChangeThumbnail}
          />
        )}

        {!!book.language && <ViewLine title='Язык написания' value={book.language} />}
        {!!book.title && !!book.originalTitle && (
          <ViewLineTouchable
            title='Оригинальное название'
            value={book.originalTitle}
            onPress={this.openTelegram}
            onLongPress={this.copyBookOriginalTitle}
          />
        )}

        {!!otherTitles && <ViewLine title='Другие названия' value={otherTitles} />}

        {all && !!book.classification && book.classification.length > 0 && this.renderClassification()}

        {all && !!book.description && <BookDescriptionLine description={book.description} />}

        {!!book.parent.length && this.renderParentBooks()}

        {!!book.films && !!book.films.length && this.renderFilms()}

        {all && !isLivelib && (
          <ViewLineAction
            title='Найти в LiveLib'
            onPress={this.forceSearchInLivelib}
            onLongPress={this.searchInLivelib}
          />
        )}

        {all && isExist && <ViewLineAction title='Редактировать название' onPress={this.openEditModal} />}

        {all && isExist && (
          <ViewLineAction title={hasPaper ? 'Есть в бумаге' : 'Нет в бумаге'} onPress={this.togglePaper} />
        )}

        {all && isExist && <ViewLineModelRemove model={book} warning='Удалить книгу из коллекции' />}
      </View>
    );
  }

  renderTranslators() {
    if (!this.props.book.translators.length) {
      return null;
    }

    const translators = this.props.book.translators;
    const title = translators.length > 1 ? 'Переводчики' : 'Переводчик';

    return <ViewLine title={title} value={translators.join('\n')} />;
  }

  renderClassification() {
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
    return (
      <View style={s.parentBooks}>
        <Text style={s.header}>ВХОДИТ В</Text>

        {this.props.book.parent.map(book => (
          <ViewLineTouchable key={book.id} onPress={() => this.openBook(book)} title={book.type} value={book.title} />
        ))}
      </View>
    );
  }

  renderFilms() {
    return (
      <View style={s.parentBooks}>
        <Text style={s.header}>ЭКРАНИЗАЦИИ</Text>

        {this.props.book.films.map(this.renderFilm)}
      </View>
    );
  }

  renderFilm(film: Film) {
    const value = film.country ? `${film.title} (${film.country})` : film.title;

    return <ViewLine key={film.id} title={film.year} value={value} />;
  }

  openBook(book: Book | ParentBook) {
    this.props.navigation.push('Details', { bookId: String(book.id) });
  }

  openEditions = () => {
    const { editionIds, editionTranslators } = this.props.book;

    this.props.navigation.push('Editions', { editionIds, translators: editionTranslators });
  };

  openTelegram = () => Linking.openURL(`tg://share?text=${this.props.book.originalTitle}`);

  openGenre = (ids: number[]) => Linking.openURL(`https://fantlab.ru/bygenre?${ids.map(i => `wg${i}=on`).join('&')}`);

  copyBookOriginalTitle = () => {
    Clipboard.setString(this.props.book.originalTitle);
    ToastAndroid.show('Название скопировано', ToastAndroid.SHORT);
  };

  openChangeThumbnail = () => {
    if (!this.props.isExist) {
      return ToastAndroid.show('Книга не добавлена в колекцию', ToastAndroid.SHORT);
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
}

const s = StyleSheet.create({
  header: {
    color: color.SecondaryText,
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
    color: color.SecondaryText,
    fontSize: 12,
  } as TextStyle,
  value: {
    color: color.PrimaryText,
    fontSize: 18,
  } as TextStyle,
});
