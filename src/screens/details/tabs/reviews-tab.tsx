import React from 'react';
import { Dimensions, Animated, ScrollView, StyleSheet, ViewStyle, View, TextStyle } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { color } from 'types/colors';
import Book from 'store/book';
import { Button } from 'components';
import { LocalReviewList } from '../components/local-review-list';
import { FantlabReviewList } from '../components/fantlab-review-list';

interface Props extends NavigationScreenProps {
  book: Book;
  scrollY: Animated.Value;
  headerHeight: number;
  y?: number;
  onScrollEnd: (y: number) => void;
}

export class ReviewsTab extends React.PureComponent<Props> {
  scrollStyle = this.props.book.status === BOOK_STATUSES.READ ? [s.withButton, s.scrollContent] : s.scrollContent;
  screenHeight = Dimensions.get('screen').height;

  y = 0;
  scroll: ScrollView;
  maxScroll = 0;

  onScrollEnd = event => {
    const y = event.nativeEvent.contentOffset.y;

    this.y = y;
    this.maxScroll = event.nativeEvent.contentOffset.height;
    this.props.onScrollEnd(y);
  };

  scrollTo(y: number) {
    this.y = y;

    if (this.scroll) {
      this.scroll.scrollTo({ y, animated: false });
    }
  }

  render() {
    const { book, scrollY, headerHeight } = this.props;
    const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true });

    return (
      <View style={s.relative}>
        <Animated.ScrollView
          style={s.scroll}
          onScroll={onScroll}
          onScrollEndDrag={this.onScrollEnd}
          onMomentumScrollEnd={this.onScrollEnd}
          contentContainerStyle={[
            this.scrollStyle,
            { minHeight: this.screenHeight + headerHeight - 200, paddingTop: headerHeight + 30 },
          ]}
          ref={this.setRef}
        >
          <LocalReviewList book={book} navigation={this.props.navigation} />
          <FantlabReviewList bookId={book.id} onLoad={this.onReviewsLoad} />
        </Animated.ScrollView>

        {book.status === BOOK_STATUSES.READ && (
          <View style={s.buttonContainer}>
            <Button
              label='Добавить'
              onPress={this.openReviewWriteModal}
              icon={<Icon name='edit' size={18} color={color.PrimaryText} />}
              style={s.button}
              textStyle={s.buttonText}
            />
          </View>
        )}
      </View>
    );
  }

  openReviewWriteModal = () => this.props.navigation.navigate('/modal/review-write', { book: this.props.book });

  onReviewsLoad = () => setTimeout(() => this.scrollTo(this.props.y), 0);

  setRef = view => {
    this.scroll = view && view._component;
    this.scrollTo(this.props.y);
  };
}

const s = StyleSheet.create({
  relative: {
    flex: 1,
    position: 'relative',
  },
  withButton: {
    paddingBottom: 60,
  } as ViewStyle,
  scroll: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    padding: 15,
  } as ViewStyle,
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  } as ViewStyle,
  button: {
    backgroundColor: color.Background,
    elevation: 3,
  } as ViewStyle,
  buttonText: {
    color: color.PrimaryText,
  } as TextStyle,
});
