import React from 'react';
import { ScrollView, StyleSheet, ViewStyle, View, TextStyle } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { color } from 'types/colors';
import Book from 'store/book';
import { Button } from 'components/button';
import { FantlabReviewList } from '../components/fantlab-review-list';

interface Props extends NavigationScreenProps {
  book: Book;
}

export class ReviewsTab extends React.PureComponent<Props> {
  render() {
    const book = this.props.book;

    return (
      <View style={s.relative}>
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
          <FantlabReviewList bookId={book.id} />
        </ScrollView>

        {book.status === BOOK_STATUSES.READ && (
          <View style={s.buttonContainer}>
            <Button
              label='Добавить'
              onPress={this.openReviewWriteModal}
              icon={<Icon name='sliders-h' size={18} color={color.PrimaryText} />}
              style={s.button}
              textStyle={s.buttonText}
            />
          </View>
        )}
      </View>
    );
  }

  openReviewWriteModal = () => this.props.navigation.navigate('/modal/review-write', { book: this.props.book });
}

const s = StyleSheet.create({
  relative: {
    flex: 1,
    position: 'relative',
  },
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
