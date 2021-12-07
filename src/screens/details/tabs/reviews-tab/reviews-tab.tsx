import React, { useCallback, useState } from 'react';
import { Platform, ViewStyle, View, TextStyle } from 'react-native';
import { Portal } from '@gorhom/portal';
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dynamic';

import { dynamicColor } from 'types/colors';
import Book from 'store/book';
import { Tag } from 'components';
import { t } from 'services';

import { LocalReviewList } from './components/local-review-list';
import { FantlabReviewList } from './components/fantlab-review-list';
import { ReviewsButtons } from './reviews-buttons';

interface Props {
  book: Book;
}

export const ReviewsTab = (props: Props) => {
  const isLiveLib = props.book.id.startsWith('l_');
  const [source, setSource] = useState(isLiveLib ? 'LiveLib' : 'Fantlab');
  const [sort, setSort] = useState('rating');

  const s = useDynamicStyleSheet(ds);
  const type = isLiveLib ? 'LiveLib' : source;
  const bookId = isLiveLib || type === 'Fantlab' ? props.book.id : props.book.lid;
  const toggleSearchSource = useCallback(() => setSource(prev => (prev === 'Fantlab' ? 'Livelib' : 'Fantlab')), []);

  return (
    <View style={ds.dark.container}>
      {type === 'Fantlab' && (
        <View style={s.sortList}>
          <SelectReviewSort sort='rating' selected={sort} setSort={setSort} title={t('details.by-rating')} />
          <SelectReviewSort sort='date' selected={sort} setSort={setSort} title={t('details.by-date')} />
          <SelectReviewSort sort='mark' selected={sort} setSort={setSort} title={t('details.by-mark')} />
        </View>
      )}

      <LocalReviewList book={props.book} />
      <FantlabReviewList bookId={bookId} type={type} sort={sort} />

      <Portal hostName='fixed'>
        <ReviewsButtons book={props.book} source={type} toggleSearchSource={toggleSearchSource} />
      </Portal>
    </View>
  );
};

interface SelectReviewSortProps {
  sort: string;
  selected: string;
  title: string;
  setSort: (sort: string) => void;
}

function SelectReviewSort(props: SelectReviewSortProps) {
  const { setSort, sort } = props;
  const onPress = useCallback(() => setSort(sort), [setSort, sort]);
  const isSelected = sort === props.selected;

  return <Tag title={props.title} selected={isSelected} onPress={onPress} outline />;
}

const ds = new DynamicStyleSheet({
  container: Platform.select({
    web: {
      padding: 16,
      paddingBottom: 64,
    },
    android: {
      padding: 16,
    },
  }),
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
    backgroundColor: dynamicColor.SearchBackground,
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
    color: dynamicColor.PrimaryText,
  } as TextStyle,
  sortList: {
    flexDirection: 'row',
  } as ViewStyle,
});
