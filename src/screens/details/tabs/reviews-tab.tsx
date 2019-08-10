import React from 'react';
import { StyleSheet, ViewStyle, View, TextStyle } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { color } from 'types/colors';
import Book from 'store/book';
import { Button } from 'components';
import { LocalReviewList } from '../components/local-review-list';
import { FantlabReviewList } from '../components/fantlab-review-list';
import { withScroll } from './tab';

interface Props extends NavigationScreenProps {
  book: Book;
}

class AddButton extends React.PureComponent<Props> {
  render() {
    const { book } = this.props;

    if (book.status !== BOOK_STATUSES.READ) {
      return null;
    }

    return (
      <View style={s.buttonContainer}>
        <Button
          label='Добавить'
          onPress={this.openReviewWriteModal}
          icon={<Icon name='edit' size={18} color={color.PrimaryText} />}
          style={s.button}
          textStyle={s.buttonText}
        />
      </View>
    );
  }

  openReviewWriteModal = () => this.props.navigation.navigate('/modal/review-write', { book: this.props.book });
}

@withScroll
export class ReviewsTab extends React.PureComponent<Props> {
  static Fixed = AddButton;

  render() {
    const { book } = this.props;
    const style = book.status === BOOK_STATUSES.READ ? s.withButton : null;

    return (
      <View style={style}>
        <LocalReviewList book={book} navigation={this.props.navigation} />
        <FantlabReviewList bookId={book.id} />
      </View>
    );
  }

  openReviewWriteModal = () => this.props.navigation.navigate('/modal/review-write', { book: this.props.book });
}

const s = StyleSheet.create({
  withButton: {
    paddingBottom: 60,
  } as ViewStyle,
  scroll: {
    flex: 1,
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
