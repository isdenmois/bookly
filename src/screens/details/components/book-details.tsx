import React from 'react';
import Book from 'store/book';
import { ImageBackground, Text, View, ScrollView } from 'react-native';
import { Thumbnail } from 'components/thumbnail';
import { BookExtended } from 'types/book-extended';
import withObservables from '@nozbe/with-observables';
import { ReadButton } from 'components/read-button';
import { BOOK_TYPES } from 'types/book-types';
import { BookDetailsHeader } from './book-details-header';
import { BookDescriptionLine, ViewLine } from './book-details-lines';

interface Props {
  book: BookExtended;
  record?: Book;
  onBack: () => void;
}

const THUMBNAIL_WIDTH = 120;
const MARGIN = 30;
const READ_BUTTON_MARGIN = 2 * MARGIN + THUMBNAIL_WIDTH;

@withObservables(['book'], ({ book }) => ({
  record: book.record || book,
}))
export class BookDetails extends React.Component<Props> {
  render() {
    const { book, record } = this.props;

    return (
      <View style={{ flexDirection: 'column', alignItems: 'stretch', flex: 1 }}>
        <ImageBackground style={{ width: '100%' }} blurRadius={1.5} source={{ uri: record.thumbnail }}>
          <View style={{ backgroundColor: 'rgba(0,0,0,.5)' }}>
            <BookDetailsHeader bookId={book.id} onBack={this.props.onBack} />
            <View style={{ flexDirection: 'row', marginBottom: -50, marginTop: MARGIN }}>
              <Thumbnail style={{ marginLeft: MARGIN }} width={120} url={record.thumbnail} />
              <View style={{ marginLeft: MARGIN, marginTop: 30, flex: 1, overflow: 'hidden' }}>
                <Text style={{ color: 'white', fontSize: 24 }}>{record.title}</Text>
                <Text style={{ color: 'white', fontSize: 18 }}>{record.author}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={{ alignSelf: 'flex-start', marginLeft: READ_BUTTON_MARGIN }}>
          <ReadButton openChangeStatus={() => null} />
        </View>

        <ScrollView style={{ flex: 1 }}>
          <ViewLine title='Тип' value={BOOK_TYPES[book.type]} />

          {!!book.genre && <ViewLine title='Жанр' value={book.genre} />}
          {!!book.year && <ViewLine title='Год' value={book.year} />}

          <BookDescriptionLine description={book.description} />

          {!!book.editionCount && <ViewLine title='Изданий' value={book.editionCount} />}
          <ViewLine title='Язык написания' value={book.language} />
          <ViewLine title='Оригинальное название' value={book.originalTitle} />
        </ScrollView>
      </View>
    );
  }
}
