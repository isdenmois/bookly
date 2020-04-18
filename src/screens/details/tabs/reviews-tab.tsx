import React, { useEffect, useMemo, useCallback } from 'react';
import { Animated, Platform, StyleSheet, ViewStyle, View, TextStyle } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { color } from 'types/colors';
import Book from 'store/book';
import { Button, Tag } from 'components';
import { LocalReviewList } from '../components/local-review-list';
import { FantlabReviewList } from '../components/fantlab-review-list';
import { withScroll } from './tab';

interface Props {
  book: Book;
  navigation: NavigationScreenProp<any>;
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

const source = observable.box('Fantlab');

function useTransformStyle(scrollY) {
  return useMemo(
    () => [
      s.buttonContainer,
      {
        transform: [
          {
            translateY: scrollY.interpolate({
              inputRange: [0, 2 * BUTTON_TOP],
              outputRange: [0, BUTTON_TOP],
              extrapolate: 'clamp',
            }),
          },
        ],
      },
    ],
    [scrollY],
  );
}

export const AddButton = observer(({ book, navigation, scrollY }: FixedProps) => {
  const hasRead = book.status === BOOK_STATUSES.READ;
  const style = useTransformStyle(scrollY);

  const openReviewWriteModal = useCallback(() => navigation.navigate('/modal/review-write', { book }), [book]);
  const toggleSearchSource = useCallback(() => source.set(source.get() === 'Fantlab' ? 'Livelib' : 'Fantlab'), []);

  useEffect(() => () => source.set('Fantlab'), []);

  if (!hasRead && !book.lid) {
    return null;
  }

  return (
    <Animated.View style={style}>
      {hasRead && (
        <Button
          label='Добавить'
          onPress={openReviewWriteModal}
          icon={<Icon name='edit' size={18} color={color.PrimaryText} />}
          style={s.button}
          textStyle={s.buttonText}
        />
      )}
      {!!book.lid && (
        <Button
          label={source.get()}
          onPress={toggleSearchSource}
          icon={<Icon name='globe' size={18} color={color.PrimaryText} />}
          style={s.button}
          textStyle={s.buttonText}
        />
      )}
    </Animated.View>
  );
});

const ReviewsTabComponent = observer((props: Props) => {
  const [sort, setSort] = React.useState('rating');
  const type = source.get();
  const bookId = type === 'Fantlab' ? props.book.id : props.book.lid;

  return (
    <>
      {type === 'Fantlab' && (
        <View style={s.sortList}>
          <SelectReviewSort sort='rating' selected={sort} setSort={setSort} title='По рейтингу' />
          <SelectReviewSort sort='date' selected={sort} setSort={setSort} title='По дате' />
          <SelectReviewSort sort='mark' selected={sort} setSort={setSort} title='По оценке' />
        </View>
      )}

      <LocalReviewList book={props.book} />
      <FantlabReviewList bookId={bookId} type={type} sort={sort} />
    </>
  );
});

export const ReviewsTab = withScroll(ReviewsTabComponent);

(ReviewsTabComponent as any).Fixed = AddButton;

function SelectReviewSort(props: SelectReviewSortProps) {
  const { setSort, sort } = props;
  const onPress = React.useCallback(() => setSort(sort), [setSort, sort]);
  const isSelected = sort === props.selected;

  return <Tag title={props.title} selected={isSelected} onPress={onPress} outline />;
}

const s = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  } as ViewStyle,
  button: {
    backgroundColor: color.Background,
    ...Platform.select({
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 1px 4px #0003',
      },
    }),
  } as ViewStyle,
  buttonText: {
    color: color.PrimaryText,
  } as TextStyle,
  sortList: {
    flexDirection: 'row',
  },
});
