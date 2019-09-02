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
  children: React.ReactNode;
}

const MARGIN = 30;
const HEADER_HEIGHT = 110;

export const BookMainInfo = React.memo(function({
  book,
  navigation,
  scrollY,
  headerHeight,
  children,
  onLayout,
}: Props) {
  const Background: any = book.thumbnail ? ThumbnailBackground : AvatarBackground;
  const bookTitle = book.title || book.originalTitle;

  return (
    <Collapsible tabbar={children} headerHeight={headerHeight} scrollY={scrollY} onLayout={onLayout}>
      <Background bookTitle={bookTitle} book={book}>
        <View style={s.darkOverlay}>
          <Header bookTitle={bookTitle} bookId={book.id} navigation={navigation} />
          <BookAuthor book={book} navigation={navigation} />
          {!book.thumbnail && <SecondaryData book={book} navigation={navigation} />}
        </View>
      </Background>

      {!!book.thumbnail && <SecondaryWithThumbnailData book={book} navigation={navigation} />}
    </Collapsible>
  );
});

function Collapsible({ tabbar, children, headerHeight, scrollY, onLayout }) {
  const headerStyle = React.useMemo(
    () =>
      headerHeight
        ? [
            s.header,
            {
              translateY: scrollY.interpolate({
                inputRange: [0, headerHeight - HEADER_HEIGHT],
                outputRange: [0, -headerHeight + HEADER_HEIGHT],
                extrapolate: 'clamp',
              }),
            },
          ]
        : null,
    [headerHeight, scrollY],
  );
  const childrenStyle = React.useMemo(
    () =>
      headerHeight
        ? {
            translateY: scrollY.interpolate({
              inputRange: [0, headerHeight - HEADER_HEIGHT],
              outputRange: [0, headerHeight - HEADER_HEIGHT],
              extrapolate: 'clamp',
            }),
          }
        : null,
    [headerHeight, scrollY],
  );

  return (
    <View style={s.collapsibleContainer}>
      <Animated.View style={headerStyle} onLayout={onLayout}>
        <View style={s.collapsible}>
          <Animated.View style={childrenStyle}>{children}</Animated.View>

          <View style={s.tabbar}>{tabbar}</View>
        </View>
      </Animated.View>
    </View>
  );
}

function AvatarBackground({ children, bookTitle }) {
  const style = React.useMemo(() => ({ backgroundColor: getAvatarBgColor(bookTitle) }), [bookTitle]);

  return <View style={style}>{children}</View>;
}

function ThumbnailBackground({ children, book }) {
  return (
    <ImageBackground style={s.imageBackground} blurRadius={1.5} source={{ uri: getThumbnailUrl(book.thumbnail) }}>
      {children}
    </ImageBackground>
  );
}

function Header({ bookTitle, navigation, bookId }) {
  const copyBookTitle = React.useCallback(() => {
    Clipboard.setString(bookTitle);
    ToastAndroid.show('Название скопировано', ToastAndroid.SHORT);
  }, [bookTitle]);
  const openTelegram = React.useCallback(() => Linking.openURL(`tg://share?text=${bookTitle}`), [bookTitle]);

  return (
    <BookDetailsHeader bookId={bookId} navigation={navigation}>
      <TouchableOpacity style={s.titleWrapper} onPress={copyBookTitle} onLongPress={openTelegram}>
        <Text style={s.title}>{bookTitle}</Text>
      </TouchableOpacity>
    </BookDetailsHeader>
  );
}

function BookAuthor({ book, navigation }) {
  const searchAuthor = React.useCallback(() => navigation.push('Search', { query: book.author }), [book, navigation]);

  return (
    <View style={book.thumbnail ? s.thumbnailPlaceholder : null}>
      <Text style={s.author} onLongPress={searchAuthor}>
        {book.author}
      </Text>
    </View>
  );
}

function SecondaryData({ book, navigation }) {
  const openChangeStatus = React.useCallback(() => navigation.navigate('/modal/change-status', { book }), [
    book,
    navigation,
  ]);

  return (
    <View style={s.status}>
      <ReadButton ratingStyle={s.whiteRating} openChangeStatus={openChangeStatus} book={book} />
    </View>
  );
}

function SecondaryWithThumbnailData({ book, navigation }) {
  const openChangeStatus = React.useCallback(() => navigation.navigate('/modal/change-status', { book }), [
    book,
    navigation,
  ]);
  const openChangeThumbnail = React.useCallback(() => {
    if (!book.status) {
      return ToastAndroid.show('Книга не добавлена в колекцию', ToastAndroid.SHORT);
    }

    if (book.editionCount <= 1) {
      return ToastAndroid.show('Недостаточно изданий для выбора', ToastAndroid.SHORT);
    }

    navigation.navigate('/modal/thumbnail-select', { book });
  }, [book, navigation]);

  return (
    <View style={s.mainInformationContainer}>
      <View style={s.secondaryBlock}>
        <View style={s.ratingButton}>
          <ReadButton ratingStyle={s.blackRating} openChangeStatus={openChangeStatus} book={book} />
        </View>

        {!!book.genre && <Text style={s.secondary}>{book.genre}</Text>}
        {!!book.year && <Text style={s.secondary}>{book.year}</Text>}
      </View>

      <TouchableOpacity onPress={openChangeThumbnail} style={s.thumbnailContainer}>
        <Thumbnail style={s.thumbnail} width={120} height={180} url={book.thumbnail} cache auto='none' />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  scroll: {
    flex: 1,
  } as ViewStyle,
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
  } as ViewStyle,
  collapsibleContainer: {
    position: 'relative',
  } as ViewStyle,
  collapsible: {
    backgroundColor: 'white',
    overflow: 'hidden',
  } as ViewStyle,
  tabbar: {
    overflow: 'hidden',
    paddingBottom: 4,
    zIndex: 5,
    backgroundColor: 'white',
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