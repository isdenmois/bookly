import React, { FC, Suspense } from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { useStore } from '@nanostores/react';

import { useApi } from 'shared/lib/fetcher';

import { ModalRoutes, ModalScreenProps } from 'navigation/routes';
import { Button, Dialog } from 'components';
import { t } from 'services';
import { api } from 'api';
import { ActivityIndicator } from 'components/activity-indicator';
import { Text } from 'components/theme';

import { BookChildrenSelect } from './components/book-children-select';
import { $bookAddingInProgress, $hasSelected, addSelectedBooks } from './model';
import { SelectedLists } from './components/selected-lists';

type Props = ModalScreenProps<ModalRoutes.SelectNextBook>;

export const SelectNextBook: FC<Props> = ({ route, navigation }) => {
  const bookId = route.params.bookId;
  const { loading, data: book, error } = useApi(api.book, { bookId }, [bookId]);
  const hasSelected = useStore($hasSelected);
  const bookAddingInProgress = useStore($bookAddingInProgress);
  const addBooks = () => addSelectedBooks(() => navigation.goBack());

  return (
    <Dialog style={s.dialog} title='settings.selectNextBook' onApply={hasSelected && !bookAddingInProgress && addBooks}>
      {(loading || bookAddingInProgress) && <ActivityIndicator />}
      {!!error && <Text variant='error'>{error}</Text>}

      {!bookAddingInProgress && !!book && (
        <Suspense fallback={<ActivityIndicator />}>
          <ScrollView>
            {book.parent.map(parent => (
              <BookChildrenSelect key={parent.id} bookId={parent.id} />
            ))}
          </ScrollView>

          <SelectedLists />
        </Suspense>
      )}

      {!bookAddingInProgress && (
        <Button style={s.button} label={t('button.add')} disabled={!hasSelected} onPress={addBooks} />
      )}
    </Dialog>
  );
};

const s = StyleSheet.create({
  dialog: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  } as ViewStyle,
  button: {
    marginTop: 20,
  } as ViewStyle,
});
