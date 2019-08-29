import React from 'react';
import {
  Animated,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ToastAndroid,
  Clipboard,
  Linking,
} from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { color } from 'types/colors';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';
import { ReadButton, Thumbnail } from 'components';
import { getThumbnailUrl } from 'components/thumbnail';
import { getAvatarBgColor } from 'components/avatar';
import { BookDetailsHeader } from './book-details-header';

interface Props extends NavigationScreenProps {
  book: Book & BookExtended;
  scrollY: Animated.Value;
  headerHeight: number;
  onLayout: Function;
}

const MARGIN = 30;

export class BookMainInfo extends React.PureComponent<Props> {
  get bookTitle() {
    return this.props.book.title || this.props.book.originalTitle;
  }

  render() {
    const book = this.props.book;
    const renderBackground = book.thumbnail ? this.renderThumbnailBackground : this.renderAvatarBackground;
    const scrollY = this.props.scrollY;
    const headerHeight = this.props.headerHeight;
    const translateY = headerHeight
      ? scrollY.interpolate({
          inputRange: [0, headerHeight - 110],
          outputRange: [0, headerHeight - 110],
          extrapolate: 'clamp',
        })
      : null;
    const headerStyle = headerHeight
      ? [
          s.header,
          {
            translateY: scrollY.interpolate({
              inputRange: [0, headerHeight - 110],
              outputRange: [0, -headerHeight + 110],
              extrapolate: 'clamp',
            }),
          },
        ]
      : null;

    return (
      <View style={{ position: 'relative' }}>
        <Animated.View style={headerStyle} onLayout={this.props.onLayout}>
          <View style={{ backgroundColor: 'white', overflow: 'hidden' }}>
            <Animated.View style={{ translateY }}>
              {renderBackground(
                <View style={s.darkOverlay}>
                  {this.renderHeader()}
                  {this.renderAuthor()}
                  {!book.thumbnail && this.renderSecondaryData()}
                </View>,
              )}

              {!!book.thumbnail && this.renderSecondaryWithThumbnailData()}
            </Animated.View>

            <View style={{ overflow: 'hidden', paddingBottom: 4, zIndex: 5, backgroundColor: 'white' }}>
              {this.props.children}
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }

  renderHeader() {
    return (
      <BookDetailsHeader bookId={this.props.book.id} navigation={this.props.navigation}>
        <TouchableOpacity style={s.titleWrapper} onPress={this.copyBookTitle} onLongPress={this.openTelegram}>
          <Text style={s.title}>{this.bookTitle}</Text>
        </TouchableOpacity>
      </BookDetailsHeader>
    );
  }

  renderAuthor() {
    return (
      <View style={this.props.book.thumbnail ? s.thumbnailPlaceholder : null}>
        <Text style={s.author} onLongPress={this.searchAuthor}>
          {this.props.book.author}
        </Text>
      </View>
    );
  }

  renderThumbnailBackground = children => (
    <ImageBackground
      style={s.imageBackground}
      blurRadius={1.5}
      source={{ uri: getThumbnailUrl(this.props.book.thumbnail) }}
    >
      {children}
    </ImageBackground>
  );

  renderAvatarBackground = children => {
    const backgroundColor = getAvatarBgColor(this.bookTitle);

    return <View style={{ backgroundColor }}>{children}</View>;
  };

  renderSecondaryData() {
    return (
      <View style={s.status}>
        <ReadButton ratingStyle={s.whiteRating} openChangeStatus={this.openChangeStatus} book={this.props.book} />
      </View>
    );
  }

  renderSecondaryWithThumbnailData() {
    const book = this.props.book;

    return (
      <View style={s.mainInformationContainer}>
        <View style={s.secondaryBlock}>
          <View style={s.ratingButton}>
            <ReadButton ratingStyle={s.blackRating} openChangeStatus={this.openChangeStatus} book={book} />
          </View>

          {!!book.genre && <Text style={s.secondary}>{book.genre}</Text>}
          {!!book.year && <Text style={s.secondary}>{book.year}</Text>}
        </View>

        <TouchableOpacity onPress={this.openChangeThumbnail} style={s.thumbnailContainer}>
          <Thumbnail style={s.thumbnail} width={120} height={180} url={this.props.book.thumbnail} cache auto='none' />
        </TouchableOpacity>
      </View>
    );
  }

  openTelegram = () => Linking.openURL(`tg://share?text=${this.bookTitle}`);

  copyBookTitle = () => {
    Clipboard.setString(this.bookTitle);
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
    paddingBottom: 10,
  } as ViewStyle,
  mainInformationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 5,
  } as ViewStyle,
  ratingButton: {
    alignSelf: 'flex-start',
  } as ViewStyle,
  thumbnailContainer: {
    transform: [{ translateY: -40 }],
    marginBottom: -40,
  } as ViewStyle,
  thumbnail: {
    marginLeft: MARGIN,
    zIndex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 5,
    borderColor: 'white',
  } as ImageStyle,
  titleWrapper: {
    flex: 1,
  } as ViewStyle,
  title: {
    color: color.PrimaryTextInverse,
    fontSize: 24,
    lineHeight: 28,
    fontFamily: 'sans-serif-medium',
  } as TextStyle,
  author: {
    color: color.PrimaryTextInverse,
    fontSize: 24,
    lineHeight: 26,
    fontFamily: 'sans-serif-light',
    paddingLeft: 52,
    paddingRight: 20,
  } as TextStyle,
  secondaryBlock: {
    flex: 1,
  } as ViewStyle,
  secondary: {
    color: color.PrimaryText,
    fontSize: 18,
    marginTop: 15,
    lineHeight: 20,
  } as TextStyle,
  thumbnailPlaceholder: {
    paddingRight: 120,
  } as ViewStyle,
  status: {
    paddingLeft: 52,
    alignSelf: 'flex-start',
  } as ViewStyle,
  blackRating: {
    color: color.PrimaryText,
    fontSize: 18,
  } as TextStyle,
  whiteRating: {
    color: color.PrimaryTextInverse,
    fontSize: 18,
  } as TextStyle,
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  } as ViewStyle,
});
