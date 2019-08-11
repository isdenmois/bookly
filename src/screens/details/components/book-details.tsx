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
  Linking,
} from 'react-native';
import { of } from 'rxjs';
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
  book: Book & BookExtended;
  onBack: () => void;
}

const THUMBNAIL_WIDTH = 120;
const MARGIN = 30;
const READ_BUTTON_MARGIN = 2 * MARGIN + THUMBNAIL_WIDTH;

@withObservables(['book'], ({ book }) => ({
  book: book.observe ? book : of(book),
}))
export class BookDetails extends React.Component<Props> {
  render() {
    const book = this.props.book;
    const renderHeader = book.thumbnail ? this.renderMainInfoWithThumbnail : this.renderMainInfoWithoutThumbnail;
    const tabsPadding = book.thumbnail ? 26 : 0;

    return (
      <BookDetailsTabs
        tabsPadding={tabsPadding}
        renderHeader={renderHeader}
        book={book}
        isExist={book && !!book.status}
        navigation={this.props.navigation}
      />
    );
  }

  renderHeader(book: Book, scrollY: Animated.Value, headerHeight) {
    return (
      <Animated.View
        style={{
          zIndex: 1,
          translateY: scrollY.interpolate({
            inputRange: [0, headerHeight - 120],
            outputRange: [0, headerHeight - 120],
            extrapolate: 'clamp',
          }),
        }}
      >
        <BookDetailsHeader bookId={book.id} onBack={this.props.onBack} />
      </Animated.View>
    );
  }

  renderMainInfoWithThumbnail = (scrollY: Animated.Value, headerHeight) => {
    const book = this.props.book;

    return (
      <>
        <ImageBackground style={s.imageBackground} blurRadius={1.5} source={{ uri: getThumbnailUrl(book.thumbnail) }}>
          <View style={s.darkOverlay}>
            {this.renderHeader(book, scrollY, headerHeight)}

            <View style={s.mainInformationContainer}>
              <Animated.View
                style={{
                  opacity: scrollY.interpolate({ inputRange: [0, headerHeight - 130], outputRange: [1, 0] }),
                  translateX: scrollY.interpolate({
                    inputRange: [0, headerHeight - 130, headerHeight - 129],
                    outputRange: [0, 0, 500],
                    extrapolate: 'clamp',
                  }),
                }}
              >
                <TouchableOpacity onPress={this.openChangeThumbnail} style={{ zIndex: 1 }}>
                  <Thumbnail style={s.thumbnail} width={120} height={180} url={book.thumbnail} cache auto='none' />
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={[
                  s.mainInformation,
                  {
                    translateX: scrollY.interpolate({
                      inputRange: [0, headerHeight - 120],
                      outputRange: [0, -70],
                      extrapolate: 'clamp',
                    }),
                    translateY: scrollY.interpolate({
                      inputRange: [0, headerHeight - 120],
                      outputRange: [0, headerHeight - 217],
                      extrapolate: 'clamp',
                    }),
                  },
                ]}
              >
                <Text style={s.title} onPress={this.copyBookTitle} onLongPress={this.openTelegram}>
                  {book.title}
                </Text>
                <Animated.View
                  style={{
                    opacity: scrollY.interpolate({ inputRange: [0, headerHeight - 140], outputRange: [1, 0] }),
                    translateX: scrollY.interpolate({
                      inputRange: [0, headerHeight - 140, headerHeight - 139],
                      outputRange: [0, 0, 500],
                      extrapolate: 'clamp',
                    }),
                  }}
                >
                  <TouchableWithoutFeedback onLongPress={this.searchAuthor}>
                    <Text style={s.author}>{book.author}</Text>
                  </TouchableWithoutFeedback>
                </Animated.View>
              </Animated.View>
            </View>
          </View>
        </ImageBackground>

        <Animated.View
          style={[
            s.statusButton,
            { opacity: scrollY.interpolate({ inputRange: [0, headerHeight - 140], outputRange: [1, 0] }) },
          ]}
        >
          <ReadButton ratingStyle={s.blackRating} openChangeStatus={this.openChangeStatus} book={book} />
        </Animated.View>
      </>
    );
  };

  renderMainInfoWithoutThumbnail = (scrollY: Animated.Value, headerHeight) => {
    const book = this.props.book;
    const backgroundColor = getAvatarBgColor(book.title);

    return (
      <View style={{ backgroundColor }}>
        <View style={s.darkOverlay}>
          {this.renderHeader(book, scrollY, headerHeight)}

          <Animated.View
            style={[
              s.mainInformationWithoutThumbnail,
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, headerHeight - 130],
                  outputRange: [0, headerHeight - 130],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          >
            <Text style={s.title} onPress={this.copyBookTitle} onLongPress={this.openTelegram}>
              {book.title}
            </Text>
            <Animated.View
              style={{
                opacity: scrollY.interpolate({ inputRange: [0, headerHeight - 130], outputRange: [1, 0] }),
                translateX: scrollY.interpolate({
                  inputRange: [0, headerHeight - 130, headerHeight - 129],
                  outputRange: [0, 0, 500],
                  extrapolate: 'clamp',
                }),
              }}
            >
              <TouchableWithoutFeedback onLongPress={this.searchAuthor}>
                <Text style={s.author}>{book.author}</Text>
              </TouchableWithoutFeedback>
              <ReadButton ratingStyle={s.whiteRating} openChangeStatus={this.openChangeStatus} book={book} />
            </Animated.View>
          </Animated.View>
        </View>
      </View>
    );
  };

  openTelegram = () => Linking.openURL(`tg://share?text=${this.props.book.title}`);

  copyBookTitle = () => {
    Clipboard.setString(this.props.book.title);
    ToastAndroid.show('Название скопировано', ToastAndroid.SHORT);
  };

  openChangeStatus = () => this.props.navigation.navigate('/modal/change-status', { book: this.props.book });

  openChangeThumbnail = () => {
    if (!this.props.book.status) {
      return ToastAndroid.show('Книга не добавлена в колекцию', ToastAndroid.SHORT);
    }

    if (this.props.book.editionCount <= 1) {
      return ToastAndroid.show('Недостаточно изданий для выбора', ToastAndroid.SHORT);
    }

    this.props.navigation.navigate('/modal/thumbnail-select', { book: this.props.book });
  };

  searchAuthor = () => {
    this.props.navigation.push('Search', { query: this.props.book.author });
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
