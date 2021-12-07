import React, { memo, useMemo } from 'react';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ToastAndroid,
  Clipboard,
  Platform,
} from 'react-native';
import { dynamicColor, boldText, lightText } from 'types/colors';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';
import { ReadButton, Thumbnail } from 'components';
import { getThumbnailUrl } from 'components/thumbnail';
import { getAvatarBgColor } from 'components/avatar';
import { withBook } from 'components/book-item';
import { BookDetailsHeader } from './book-details-header';
import { getNavigation, openModal, t } from 'services';
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dynamic';
import { openInTelegram } from 'screens/book-select/book-selector';
import { MainRoutes, ModalRoutes } from 'navigation/routes';
import { CoordinatorPinned } from 'components/coordinator/coordinator-header';

interface Props {
  book: Book & BookExtended;
}

const MARGIN = 30;

export const BookMainInfo = memo<Props>(
  withBook(({ book }: Props) => {
    const Background: any = book.thumbnail ? ThumbnailBackground : AvatarBackground;
    const bookTitle = book.title || book.originalTitle;

    const s = useDynamicStyleSheet(ds); // eslint-disable-line react-hooks/rules-of-hooks

    return (
      <>
        <Background bookTitle={bookTitle} book={book}>
          <View style={s.darkOverlay} testID={`details${book.id}`}>
            <Header bookTitle={bookTitle} bookId={book.id} />
            <BookAuthor book={book} />
            {!book.thumbnail && <SecondaryData book={book} />}
          </View>
        </Background>

        {!!book.thumbnail && <SecondaryWithThumbnailData book={book} />}

        {Platform.OS !== 'web' && (
          <CoordinatorPinned>
            <Background bookTitle={bookTitle} book={book}>
              <View style={s.darkOverlay} testID={`details${book.id}`}>
                <Header bookTitle={bookTitle} bookId={book.id} />
              </View>
            </Background>
          </CoordinatorPinned>
        )}
      </>
    );
  }),
);

function AvatarBackground({ children, bookTitle }) {
  const style = useMemo(() => ({ backgroundColor: getAvatarBgColor(bookTitle) }), [bookTitle]);

  return <View style={style}>{children}</View>;
}

function ThumbnailBackground({ children, book }) {
  const s = useDynamicStyleSheet(ds);

  return (
    <ImageBackground style={s.imageBackground} blurRadius={1.5} source={{ uri: getThumbnailUrl(book.thumbnail) }}>
      {children}
    </ImageBackground>
  );
}

function Header({ bookTitle, bookId }) {
  const s = useDynamicStyleSheet(ds);
  const copyBookTitle = () => {
    Clipboard.setString(bookTitle);
    ToastAndroid.show(t('details.copied'), ToastAndroid.SHORT);
  };
  const openTelegram = () => openInTelegram(bookTitle);

  return (
    <BookDetailsHeader bookId={bookId}>
      <TouchableOpacity style={s.titleWrapper} onPress={openTelegram} onLongPress={copyBookTitle}>
        <Text style={s.title}>{bookTitle}</Text>
      </TouchableOpacity>
    </BookDetailsHeader>
  );
}

function BookAuthor({ book }) {
  const s = useDynamicStyleSheet(ds);
  const searchAuthor = () => getNavigation().push(MainRoutes.Search, { query: book.author });

  return (
    <View style={book.thumbnail ? s.thumbnailPlaceholder : null}>
      <Text style={s.author} onPress={searchAuthor}>
        {book.author}
      </Text>
    </View>
  );
}

function SecondaryData({ book }) {
  const s = useDynamicStyleSheet(ds);
  const openChangeStatus = () => openModal(ModalRoutes.ChangeStatus, { book });

  return (
    <View style={s.status}>
      <ReadButton
        ratingStyle={s.whiteRating}
        openChangeStatus={openChangeStatus}
        book={book}
        status={book.status}
        testID='detailsStatusButton'
      />
    </View>
  );
}

function SecondaryWithThumbnailData({ book }) {
  const s = useDynamicStyleSheet(ds);
  const openChangeStatus = () => openModal(ModalRoutes.ChangeStatus, { book });
  const openChangeThumbnail = () => {
    if (book.id.startsWith('l_')) {
      return ToastAndroid.show('Возможность доступна только для FantLab книг', ToastAndroid.SHORT);
    }

    if (!book.status) {
      return ToastAndroid.show(t('details.should-add'), ToastAndroid.SHORT);
    }

    if (book.editionCount <= 1) {
      return ToastAndroid.show('Недостаточно изданий для выбора', ToastAndroid.SHORT);
    }

    openModal(ModalRoutes.ThumbnailSelect, { book });
  };

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
    borderColor: dynamicColor.Background,
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
