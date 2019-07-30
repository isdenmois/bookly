import React from 'react';
import {
  Animated,
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
    const renderHeader = record.thumbnail ? this.renderMainInfoWithThumbnail : this.renderMainInfoWithoutThumbnail;

    return (
      <BookDetailsTabs renderHeader={renderHeader} book={book} record={record} navigation={this.props.navigation} />
    );
  }

  renderHeader(book: Book, scrollY: Animated.Value, headerHeight) {
    return (
      <Animated.View
        style={{
          zIndex: 1,
          translateY: scrollY.interpolate({
            inputRange: [0, headerHeight - 150],
            outputRange: [0, headerHeight - 150],
            extrapolate: 'clamp',
          }),
        }}
      >
        <BookDetailsHeader bookId={book.id} onBack={this.props.onBack} />
      </Animated.View>
    );
  }

  renderMainInfoWithThumbnail = (scrollY: Animated.Value, headerHeight) => {
    const record = this.props.record;

    return (
      <>
        <ImageBackground style={s.imageBackground} blurRadius={1.5} source={{ uri: getThumbnailUrl(record.thumbnail) }}>
          <View style={s.darkOverlay}>
            {this.renderHeader(record, scrollY, headerHeight)}

            <View style={s.mainInformationContainer}>
              <Animated.View
                style={{
                  opacity: scrollY.interpolate({ inputRange: [0, headerHeight - 150], outputRange: [1, 0] }),
                  translateX: scrollY.interpolate({
                    inputRange: [0, headerHeight - 150, headerHeight - 149],
                    outputRange: [0, 0, 500],
                    extrapolate: 'clamp',
                  }),
                }}
              >
                <TouchableOpacity onPress={this.openChangeThumbnail} style={{ zIndex: 1 }}>
                  <Thumbnail style={s.thumbnail} width={120} url={record.thumbnail} cache />
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={[
                  s.mainInformation,
                  {
                    translateX: scrollY.interpolate({
                      inputRange: [0, headerHeight - 150],
                      outputRange: [0, -70],
                      extrapolate: 'clamp',
                    }),
                    translateY: scrollY.interpolate({
                      inputRange: [0, headerHeight - 150],
                      outputRange: [0, headerHeight - 250],
                      extrapolate: 'clamp',
                    }),
                  },
                ]}
              >
                <TouchableWithoutFeedback onLongPress={this.copyBookTitle}>
                  <Text style={s.title}>{record.title}</Text>
                </TouchableWithoutFeedback>
                <Animated.View
                  style={{
                    opacity: scrollY.interpolate({ inputRange: [0, headerHeight - 150], outputRange: [1, 0] }),
                    translateX: scrollY.interpolate({
                      inputRange: [0, headerHeight - 150, headerHeight - 149],
                      outputRange: [0, 0, 500],
                      extrapolate: 'clamp',
                    }),
                  }}
                >
                  <TouchableWithoutFeedback onLongPress={this.searchAuthor}>
                    <Text style={s.author}>{record.author}</Text>
                  </TouchableWithoutFeedback>
                </Animated.View>
              </Animated.View>
            </View>
          </View>
        </ImageBackground>

        <Animated.View
          style={[
            s.statusButton,
            { opacity: scrollY.interpolate({ inputRange: [0, headerHeight - 150], outputRange: [1, 0] }) },
          ]}
        >
          <ReadButton ratingStyle={s.blackRating} openChangeStatus={this.openChangeStatus} book={record} />
        </Animated.View>
      </>
    );
  };

  renderMainInfoWithoutThumbnail = (scrollY: Animated.Value, headerHeight) => {
    const record = this.props.record;
    const backgroundColor = getAvatarBgColor(record.title);

    return (
      <View style={{ backgroundColor }}>
        <View style={s.darkOverlay}>
          {this.renderHeader(record, scrollY, headerHeight)}

          <View style={s.mainInformationWithoutThumbnail}>
            <TouchableWithoutFeedback onLongPress={this.copyBookTitle}>
              <Text style={s.title}>{record.title}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onLongPress={this.searchAuthor}>
              <Text style={s.author}>{record.author}</Text>
            </TouchableWithoutFeedback>
            <ReadButton ratingStyle={s.whiteRating} openChangeStatus={this.openChangeStatus} book={record} />
          </View>
        </View>
      </View>
    );
  };

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

  searchAuthor = () => {
    this.props.navigation.push('Search', { query: this.props.record.author });
  };
}

const s = StyleSheet.create({
  scroll: {
    flex: 1,
  } as ViewStyle,
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
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
    overflow: 'hidden',
  } as ViewStyle,
  thumbnail: {
    marginLeft: MARGIN,
    zIndex: 1,
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
