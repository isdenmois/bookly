import React, { useMemo, memo } from 'react';
import { Platform, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Animated from 'react-native-reanimated';

import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { dynamicColor, useSColor } from 'types/colors';
import Book from 'store/book';
import { Button } from 'components';
import { openModal, t } from 'services';
import { DynamicStyleSheet } from 'react-native-dynamic';
import { ModalRoutes } from 'navigation/routes';
import { useCoordinator } from 'components/coordinator/coordinator-context';

interface Props {
  book: Book;
  source: string;
  toggleSearchSource: () => void;
}

export const ReviewsButtons = memo<Props>(({ book, source, toggleSearchSource }) => {
  const { scrollY } = useCoordinator() ?? {};
  const { s, color } = useSColor(ds);
  const style = useTransformStyle(scrollY, s);

  const openReviewWriteModal = () => openModal(ModalRoutes.ReviewWrite, { book });

  const hasRead = book.status === BOOK_STATUSES.READ;

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
          label={source}
          onPress={toggleSearchSource}
          icon={<Icon name='globe' size={18} color={color.PrimaryText} />}
          style={s.button}
          textStyle={s.buttonText}
        />
      )}
    </Animated.View>
  );
});

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
