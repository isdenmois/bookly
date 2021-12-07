import React, { useEffect, useMemo, useCallback } from 'react';
import { Platform, ViewStyle, View, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Animated from 'react-native-reanimated';

import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { dynamicColor, useSColor } from 'types/colors';
import Book from 'store/book';
import { Button, Tag } from 'components';
import { LocalReviewList } from '../components/local-review-list';
import { FantlabReviewList } from '../components/fantlab-review-list';
import { openModal, t } from 'services';
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dynamic';
import { createState } from 'utils/state';
import { MainRoutes, MainScreenProps, ModalRoutes } from 'navigation/routes';
import { useCoordinator } from 'components/coordinator/coordinator-context';
import { Portal } from '@gorhom/portal';

type Props = MainScreenProps<MainRoutes.Details> & {
  book: Book;
};

interface SelectReviewSortProps {
  sort: string;
  selected: string;
  title: string;
  setSort: (sort: string) => void;
}

const BUTTON_TOP = 60;

function useTransformStyle(scrollY, s) {
  return useMemo(
    () => [
      s.buttonContainer,
      Platform.OS === 'web'
        ? { position: 'fixed', bottom: 32 }
        : {
            transform: [
              {
                translateY: scrollY?.interpolate({
                  inputRange: [0, 2 * BUTTON_TOP],
                  outputRange: [0, BUTTON_TOP],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
    ],
    [scrollY, s.buttonContainer],
  );
}

const [source, useValue] = createState({ type: 'Fantlab' });

export const AddButton = ({ book }) => {
  const { scrollY } = useCoordinator() ?? {};
  const hasRead = book.status === BOOK_STATUSES.READ;
  const { s, color } = useSColor(ds);
  const style = useTransformStyle(scrollY, s);
  const type = useValue('type');

  const openReviewWriteModal = useCallback(() => openModal(ModalRoutes.ReviewWrite, { book }), [book]);
  const toggleSearchSource = useCallback(
    () => source.set('type', source.type === 'Fantlab' ? 'Livelib' : 'Fantlab'),
    [],
  );

  useEffect(() => () => source.set('type', 'Fantlab'), []);

  if (!hasRead && !book.lid) {
    return null;
  }

  return (
    <Animated.View style={style}>
      {hasRead && (
        <Button
          label={t('button.add')}
          onPress={openReviewWriteModal}
          icon={<Icon name='edit' size={18} color={color.PrimaryText} />}
          style={s.button}
          textStyle={s.buttonText}
        />
      )}
      {!!book.lid && (
        <Button
          label={type}
          onPress={toggleSearchSource}
          icon={<Icon name='globe' size={18} color={color.PrimaryText} />}
          style={s.button}
          textStyle={s.buttonText}
        />
      )}
    </Animated.View>
  );
};

export const ReviewsTab = (props: Props) => {
  const s = useDynamicStyleSheet(ds);
  const [sort, setSort] = React.useState('rating');
  const isLiveLib = props.book.id.startsWith('l_');
  const typeRaw = useValue('type');
  const type = isLiveLib ? 'LiveLib' : typeRaw;
  const bookId = isLiveLib || type === 'Fantlab' ? props.book.id : props.book.lid;

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
        <AddButton book={props.book} />
      </Portal>
    </View>
  );
};

function SelectReviewSort(props: SelectReviewSortProps) {
  const { setSort, sort } = props;
  const onPress = React.useCallback(() => setSort(sort), [setSort, sort]);
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
  },
});
