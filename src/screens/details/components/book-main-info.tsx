import React, { memo } from 'react';
import {
  Animated,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ToastAndroid,
  Clipboard,
  Linking,
} from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import { dynamicColor, boldText, lightText } from 'types/colors';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';
import { ReadButton, Thumbnail } from 'components';
import { getThumbnailUrl } from 'components/thumbnail';
import { getAvatarBgColor } from 'components/avatar';
import { withBook } from 'components/book-item';
import { LiveLibBook } from 'services/api/livelib/book';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { BookDetailsHeader } from './book-details-header';
import { t } from 'services';
import { DynamicStyleSheet } from 'react-native-dynamic';

interface Props {
  book: Book & BookExtended & LiveLibBook;
  scrollY: Animated.Value;
  headerHeight: number;
  onLayout: Function;
  scrollHeight: number;
  children?: React.ReactNode;
  navigation: NavigationStackProp;
  status?: BOOK_STATUSES;
  mode: string;
}

const MARGIN = 30;

export const BookMainInfo = memo(
  withBook(function ({ book, navigation, scrollY, headerHeight, scrollHeight, children, onLayout, mode }: Props) {
    const Background: any = book.thumbnail ? ThumbnailBackground : AvatarBackground;
    const bookTitle = book.title || book.originalTitle;
    const s = ds[mode];

    return (
      <Collapsible
        tabbar={children}
        headerHeight={headerHeight}
        scrollY={scrollY}
        onLayout={onLayout}
        scrollHeight={scrollHeight}
        mode={mode}
      >
        <Background bookTitle={bookTitle} book={book} mode={mode}>
          <View style={s.darkOverlay} testID={`Details${book.id}`}>
            <Header bookTitle={bookTitle} bookId={book.id} navigation={navigation} mode={mode} />
            <BookAuthor book={book} navigation={navigation} mode={mode} />
            {!book.thumbnail && <SecondaryData book={book} navigation={navigation} mode={mode} />}
          </View>
        </Background>

        {!!book.thumbnail && <SecondaryWithThumbnailData book={book} navigation={navigation} mode={mode} />}
      </Collapsible>
    );
  }),
);

function Collapsible({ tabbar, children, headerHeight, scrollY, onLayout, scrollHeight, mode }) {
  const s = ds[mode];
  const headerStyle = React.useMemo(
    () =>
      headerHeight
        ? [
            s.header,
            {
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, headerHeight - scrollHeight],
                    outputRange: [0, -headerHeight + scrollHeight],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]
        : null,
    [headerHeight, scrollY, scrollHeight],
  );
  const childrenStyle = React.useMemo(
    () =>
      headerHeight
        ? {
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, headerHeight - scrollHeight],
                  outputRange: [0, headerHeight - scrollHeight],
                  extrapolate: 'clamp',
                }),
              },
            ],
          }
        : null,
    [headerHeight, scrollY, scrollHeight],
  );

  return (
    <Animated.View style={headerStyle} onLayout={onLayout}>
      <View style={s.collapsible}>
        <Animated.View style={childrenStyle}>{children}</Animated.View>

        {tabbar && <View style={s.tabbar}>{tabbar}</View>}
      </View>
    </Animated.View>
  );
}

function AvatarBackground({ children, bookTitle }) {
  const style = React.useMemo(() => ({ backgroundColor: getAvatarBgColor(bookTitle) }), [bookTitle]);

  return <View style={style}>{children}</View>;
}

function ThumbnailBackground({ children, book, mode }) {
  const s = ds[mode];

  return (
    <ImageBackground style={s.imageBackground} blurRadius={1.5} source={{ uri: getThumbnailUrl(book.thumbnail) }}>
      {children}
    </ImageBackground>
  );
}

function Header({ bookTitle, navigation, bookId, mode }) {
  const s = ds[mode];
  const copyBookTitle = React.useCallback(() => {
    Clipboard.setString(bookTitle);
    ToastAndroid.show(t('details.copied'), ToastAndroid.SHORT);
  }, [bookTitle]);
  const openTelegram = React.useCallback(() => Linking.openURL(`tg://share?text=${bookTitle}`), [bookTitle]);

  return (
    <BookDetailsHeader bookId={bookId} navigation={navigation}>
      <TouchableOpacity style={s.titleWrapper} onPress={openTelegram} onLongPress={copyBookTitle}>
        <Text style={s.title}>{bookTitle}</Text>
      </TouchableOpacity>
    </BookDetailsHeader>
  );
}

function BookAuthor({ book, navigation, mode }) {
  const s = ds[mode];
  const searchAuthor = React.useCallback(() => navigation.push('Search', { query: book.author }), [book, navigation]);

  return (
    <View style={book.thumbnail ? s.thumbnailPlaceholder : null}>
      <Text style={s.author} onPress={searchAuthor}>
        {book.author}
      </Text>
    </View>
  );
}

function SecondaryData({ book, navigation, mode }) {
  const s = ds[mode];
  const openChangeStatus = React.useCallback(() => navigation.navigate('/modal/change-status', { book }), [
    book,
    navigation,
  ]);

  return (
    <View style={s.status}>
      <ReadButton ratingStyle={s.whiteRating} openChangeStatus={openChangeStatus} book={book} status={book.status} />
    </View>
  );
}

function SecondaryWithThumbnailData({ book, navigation, mode }) {
  const s = ds[mode];
  const openChangeStatus = React.useCallback(() => navigation.navigate('/modal/change-status', { book }), [
    book,
    navigation,
  ]);
  const openChangeThumbnail = React.useCallback(() => {
    if (book.id.startsWith('l_')) {
      return ToastAndroid.show('Возможность доступна только для FantLab книг', ToastAndroid.SHORT);
    }

    if (!book.status) {
      return ToastAndroid.show(t('details.should-add'), ToastAndroid.SHORT);
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

        {!!book.publishing && <Text style={s.secondary}>{book.publishing}</Text>}
        {!!book.genre && <Text style={s.secondary}>{book.genre}</Text>}
        {!!book.year && (
          <Text style={s.secondary}>
            {book.avgRating ? book.avgRating + ', ' : ''}
            {book.year}
          </Text>
        )}
        {!book.year && !!book.avgRating && <Text style={s.secondary}>{book.avgRating}</Text>}
      </View>

      <TouchableOpacity onPress={openChangeThumbnail} style={s.thumbnailContainer}>
        <Thumbnail style={s.thumbnail} width={120} height={180} url={book.thumbnail} cache />
      </TouchableOpacity>
    </View>
  );
}

const ds = new DynamicStyleSheet({
  scroll: {
    flex: 1,
  } as ViewStyle,
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
  } as ViewStyle,
  collapsible: {
    backgroundColor: dynamicColor.Background,
    overflow: 'hidden',
  } as ViewStyle,
  tabbar: {
    overflow: 'hidden',
    paddingBottom: 2,
    zIndex: 5,
    backgroundColor: dynamicColor.Background,
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
    backgroundColor: dynamicColor.Background,
  } as ImageStyle,
  titleWrapper: {
    flex: 1,
  } as ViewStyle,
  title: {
    color: dynamicColor.PrimaryTextInverse,
    fontSize: 24,
    lineHeight: 30,
    ...boldText,
  } as TextStyle,
  author: {
    color: dynamicColor.PrimaryTextInverse,
    fontSize: 24,
    lineHeight: 26,
    paddingLeft: 52,
    paddingRight: 20,
    ...lightText,
  } as TextStyle,
  secondaryBlock: {
    flex: 1,
  } as ViewStyle,
  secondary: {
    color: dynamicColor.PrimaryText,
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
    color: dynamicColor.PrimaryText,
    fontSize: 18,
  } as TextStyle,
  whiteRating: {
    color: dynamicColor.PrimaryTextInverse,
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
