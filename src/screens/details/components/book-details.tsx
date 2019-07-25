import React from 'react';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ToastAndroid,
  Clipboard,
} from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import withObservables from '@nozbe/with-observables';
import { color } from 'types/colors';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';
import { ReadButton, Thumbnail } from 'components';
import { getThumbnailUrl } from 'components/thumbnail';
import { getAvatarBgColor } from 'components/avatar';
import { BookDetailsHeader } from './book-details-header';
import { BookDetailsTabs } from '../tabs';

interface Props extends NavigationScreenProps {
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
      <View style={s.container}>
        {!!record.thumbnail && this.renderMainInfoWithThumbnail()}
        {!record.thumbnail && this.renderMainInfoWithoutThumbnail()}

        <BookDetailsTabs book={book} record={record} navigation={this.props.navigation} />
      </View>
    );
  }

  renderMainInfoWithThumbnail() {
    const record = this.props.record;

    return (
      <>
        <ImageBackground style={s.imageBackground} blurRadius={1.5} source={{ uri: getThumbnailUrl(record.thumbnail) }}>
          <View style={s.darkOverlay}>
            <BookDetailsHeader bookId={record.id} onBack={this.props.onBack} />
            <View style={s.mainInformationContainer}>
              <TouchableOpacity onPress={this.openChangeThumbnail}>
                <Thumbnail style={s.thumbnail} width={120} url={record.thumbnail} cache />
              </TouchableOpacity>

              <View style={s.mainInformation}>
                <TouchableWithoutFeedback onLongPress={this.copyBookTitle}>
                  <Text style={s.title}>{record.title}</Text>
                </TouchableWithoutFeedback>
                <Text style={s.author}>{record.author}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={s.statusButton}>
          <ReadButton ratingStyle={s.blackRating} openChangeStatus={this.openChangeStatus} book={record} />
        </View>
      </>
    );
  }

  renderMainInfoWithoutThumbnail() {
    const record = this.props.record;
    const backgroundColor = getAvatarBgColor(record.title);

    return (
      <View style={{ backgroundColor }}>
        <View style={s.darkOverlay}>
          <BookDetailsHeader bookId={record.id} onBack={this.props.onBack} />
          <View style={s.mainInformationWithoutThumbnail}>
            <TouchableWithoutFeedback onLongPress={this.copyBookTitle}>
              <Text style={s.title}>{record.title}</Text>
            </TouchableWithoutFeedback>
            <Text style={s.author}>{record.author}</Text>
            <ReadButton ratingStyle={s.whiteRating} openChangeStatus={this.openChangeStatus} book={record} />
          </View>
        </View>
      </View>
    );
  }

  copyBookTitle = () => {
    Clipboard.setString(this.props.record.title);
    ToastAndroid.show('Название скопировано', ToastAndroid.SHORT);
  };

  openChangeStatus = () => this.props.navigation.navigate('/modal/change-status', { book: this.props.record });

  openChangeThumbnail = () => {
    if (!this.props.record.collection) {
      return ToastAndroid.show('Книга не добавлена в колекцию', ToastAndroid.SHORT);
    }

    if (this.props.book.editionCount <= 1) {
      return ToastAndroid.show('Недостаточно изданий для выбора', ToastAndroid.SHORT);
    }

    this.props.navigation.navigate('/modal/thumbnail-select', { book: this.props.record });
  };
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    flex: 1,
  } as ViewStyle,
  imageBackground: {
    width: '100%',
  } as ViewStyle,
  darkOverlay: {
    backgroundColor: 'rgba(0,0,0,.5)',
  } as ViewStyle,
  mainInformationContainer: {
    flexDirection: 'row',
    marginBottom: -50,
    marginTop: MARGIN,
  } as ViewStyle,
  thumbnail: {
    marginLeft: MARGIN,
  } as ImageStyle,
  mainInformation: {
    marginLeft: MARGIN,
    marginTop: MARGIN,
    marginBottom: 65,
    flex: 1,
    overflow: 'hidden',
  } as ViewStyle,
  title: {
    color: color.PrimaryTextInverse,
    fontSize: 24,
  } as TextStyle,
  author: {
    color: color.PrimaryTextInverse,
    fontSize: 18,
  } as TextStyle,
  statusButton: {
    alignSelf: 'flex-start',
    marginLeft: READ_BUTTON_MARGIN,
    marginBottom: 0,
  } as TextStyle,
  mainInformationWithoutThumbnail: {
    alignItems: 'flex-start',
    marginHorizontal: 15,
    marginBottom: 15,
  } as ViewStyle,
  blackRating: {
    color: color.PrimaryText,
    fontSize: 18,
  } as TextStyle,
  whiteRating: {
    color: color.PrimaryTextInverse,
    fontSize: 18,
  } as TextStyle,
});
