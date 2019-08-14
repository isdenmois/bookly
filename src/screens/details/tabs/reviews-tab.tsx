import React from 'react';
import { Animated, StyleSheet, ViewStyle, View, TextStyle, TouchableOpacity, Text } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { color } from 'types/colors';
import Book from 'store/book';
import { Button, TouchIcon } from 'components';
import { LocalReviewList } from '../components/local-review-list';
import { FantlabReviewList } from '../components/fantlab-review-list';
import { withScroll } from './tab';

interface Props extends NavigationScreenProps {
  book: Book;
}

interface FixedProps extends Props {
  scrollY: Animated.Value;
}

interface SelectReviewSortProps {
  sort: string;
  selected: string;
  title: string;
  setSort: (sort: string) => void;
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
    const book = this.props.book;

    if (book.status !== BOOK_STATUSES.READ) {
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

  openReviewWriteModal = () => this.props.navigation.navigate('/modal/review-write', { book: this.props.book });
}

function ReviewsTabComponent(props: Props) {
  const [sort, setSort] = React.useState('rating');

  return (
    <View>
      <View style={s.sortList}>
        <SelectReviewSort sort='rating' selected={sort} setSort={setSort} title='По рейтингу' />
        <SelectReviewSort sort='date' selected={sort} setSort={setSort} title='По дате' />
        <SelectReviewSort sort='mark' selected={sort} setSort={setSort} title='По оценке' />
      </View>

      <LocalReviewList book={props.book} />
      <FantlabReviewList bookId={props.book.id} sort={sort} />
    </View>
  );
}

export const ReviewsTab = withScroll(ReviewsTabComponent);

ReviewsTabComponent.Fixed = AddButton;

function SelectReviewSort(props: SelectReviewSortProps) {
  const onPress = React.useCallback(() => props.setSort(props.sort), [props.sort]);
  const isSelected = props.sort === props.selected;
  const Component: any = isSelected ? View : TouchableOpacity;

  return (
    <Component style={isSelected ? s.sortSelected : s.sortItem} onPress={onPress}>
      <Text style={s.sortText}>{props.title}</Text>
    </Component>
  );
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
  sortList: {
    flexDirection: 'row',
  },
  sortItem: {
    marginRight: 20,
    borderWidth: 0.5,
    borderColor: 'transparent',
  },
  sortSelected: {
    borderRadius: 20,
    borderColor: color.Review,
    borderWidth: 0.5,
    marginRight: 20,
  } as ViewStyle,
  sortText: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: color.Review,
  } as TextStyle,
});
