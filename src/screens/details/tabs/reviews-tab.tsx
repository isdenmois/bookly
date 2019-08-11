import React from 'react';
import { Animated, StyleSheet, ViewStyle, View, TextStyle } from 'react-native';
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
  record: Book;
}

interface FixedProps extends Props {
  scrollY: Animated.Value;
}

const BUTTON_TOP = 60;

class AddButton extends React.PureComponent<FixedProps> {
  transform = [
    {
      translateY: this.props.scrollY.interpolate({
        inputRange: [0, 2 * BUTTON_TOP],
        outputRange: [0, BUTTON_TOP],
        extrapolate: 'clamp',
      }),
    },
  ];

  style = [s.buttonContainer, { transform: this.transform }];

  render() {
    const { record } = this.props;

    if (record.status !== BOOK_STATUSES.READ) {
      return null;
    }

    return (
      <Animated.View style={this.style}>
        <Button
          label='Добавить'
          onPress={this.openReviewWriteModal}
          icon={<Icon name='edit' size={18} color={color.PrimaryText} />}
          style={s.button}
          textStyle={s.buttonText}
        />
      </Animated.View>
    );
  }

  openReviewWriteModal = () => this.props.navigation.navigate('/modal/review-write', { book: this.props.record });
}

@withScroll
export class ReviewsTab extends React.PureComponent<Props> {
  static Fixed = AddButton;

  render() {
    const { record } = this.props;

    return (
      <View>
        <LocalReviewList book={record} />
        <FantlabReviewList bookId={record.id} />
      </View>
    );
  }

  openReviewWriteModal = () => this.props.navigation.navigate('/modal/review-write', { book: this.props.record });
}

const s = StyleSheet.create({
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
