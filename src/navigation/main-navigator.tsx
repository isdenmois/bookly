import React from 'react';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';

import { HomeScreen } from 'screens/home/home.screen';
import { ReadListScreen } from 'screens/book-list/read-list.screen';
import { WishListScreen } from 'screens/book-list/wish-list.screen';
import { SearchScreen } from 'screens/search/search.screen';
import { DetailsScreen } from 'screens/details/details.screen';
import { EditionsListScreen } from 'screens/editions/editions.screen';
import { BookSelectScreen } from 'screens/book-select/book-select.screen';
import { StatScreen } from 'screens/stat/stat.screen';
import { WorkListScreen } from 'screens/work-list/work-list.screen';
import { TopRateScreen } from 'screens/top-rate/top-rate.screen';
import { AuthorsScreen } from 'screens/authors/authors.screen';
import { AuthorSearchScreen } from 'screens/authors/author-search.screen';
import { SettingsScreen } from 'screens/settings/settings.screen';
import { ListsScreen } from 'screens/lists/lists.screen';

import { ChangeStatusModal } from 'modals/change-status/change-status.modal';
import { BookSelectModal } from 'modals/book-select/book-select.modal';
import { BookFiltersModal } from 'modals/book-filters/book-filters.modal';
import { ThumbnailSelectModal } from 'modals/thumbnail-select/thumbnail-select.modal';
import { ReviewWriteModal } from 'modals/review-write/review-write.modal';
import { FantlabLoginModal } from 'modals/fantlab-login/fantlab-login.modal';
import { BookTitleEditModal } from 'modals/book-title-edit/book-title-edit.modal';
import { ScanIsbnModal } from 'modals/scan-isbn/scan-isbn.modal';
import { ListAddModal } from 'modals/list-add.modal';
import { ListEditModal } from 'modals/list-edit.modal';
import { ListBookSelectModal } from 'modals/list-book-select.modal';
import { BookActionsModal } from 'modals/book-actions';
import { BookEditorModal } from 'modals/book-editor/book-editor.modal';
import { SelectNextBook } from 'modals/select-next-book';

import { ModalRoutes } from './routes';

import { t } from 'services';
import { headerBackImage } from 'components/screen-header';
import { useColor } from 'types/colors';
import { MainRoutes } from './routes';

export const mainScreens = {
  screens: {
    Home: '/',
    Profile: 'user',
  },
};

const Stack = createStackNavigator();

export function MainNavigator() {
  const color = useColor();

  return (
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{
          headerTintColor: color.PrimaryText,
          headerBackImage,
          cardStyle: { flex: 1, backgroundColor: color.Background },
        }}
      >
        <Stack.Screen name={MainRoutes.Home} component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name={MainRoutes.Search} component={SearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name={MainRoutes.ReadList} component={ReadListScreen} options={{ headerShown: false }} />
        <Stack.Screen name={MainRoutes.WishList} component={WishListScreen} options={{ headerShown: false }} />
        <Stack.Screen name={MainRoutes.Details} component={DetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name={MainRoutes.Editions}
          component={EditionsListScreen}
          options={{ headerTitle: t('headers.editions') }}
        />
        <Stack.Screen
          name={MainRoutes.BookSelect}
          component={BookSelectScreen}
          options={{ headerTitle: t('headers.book-select') }}
        />
        <Stack.Screen name={MainRoutes.Stat} component={StatScreen} options={{ headerTitle: t('nav.stat') }} />
        <Stack.Screen name={MainRoutes.WorkList} component={WorkListScreen} />
        <Stack.Screen name={MainRoutes.TopRate} component={TopRateScreen} options={{ headerTitle: t('top.compare') }} />
        <Stack.Screen name={MainRoutes.Authors} component={AuthorsScreen} options={{ headerShown: false }} />
        <Stack.Screen name={MainRoutes.AuthorSearch} component={AuthorSearchScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name={MainRoutes.Settings}
          component={SettingsScreen}
          options={{ headerTitle: t('nav.settings') }}
        />
        <Stack.Screen name={MainRoutes.Lists} component={ListsScreen} options={{ headerTitle: t('headers.lists') }} />
      </Stack.Group>

      <Stack.Group screenOptions={modalOptions}>
        <Stack.Screen name={ModalRoutes.ChangeStatus} component={ChangeStatusModal} />
        <Stack.Screen name={ModalRoutes.BookSelect} component={BookSelectModal} />
        <Stack.Screen name={ModalRoutes.BookFilters} component={BookFiltersModal} />
        <Stack.Screen name={ModalRoutes.ThumbnailSelect} component={ThumbnailSelectModal} />
        <Stack.Screen name={ModalRoutes.ReviewWrite} component={ReviewWriteModal} />
        <Stack.Screen name={ModalRoutes.FantlabLogin} component={FantlabLoginModal} />
        <Stack.Screen name={ModalRoutes.BookTitleEdit} component={BookTitleEditModal} />
        <Stack.Screen name={ModalRoutes.ScanIsbn} component={ScanIsbnModal} />
        <Stack.Screen name={ModalRoutes.ListAdd} component={ListAddModal} />
        <Stack.Screen name={ModalRoutes.ListEdit} component={ListEditModal} />
        <Stack.Screen name={ModalRoutes.ListBookSelect} component={ListBookSelectModal} />
        <Stack.Screen name={ModalRoutes.BookActions} component={BookActionsModal} />
        <Stack.Screen name={ModalRoutes.BookEditor} component={BookEditorModal} />
        <Stack.Screen name={ModalRoutes.SelectNextBook} component={SelectNextBook} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const modalOptions: StackNavigationOptions = {
  animationEnabled: true,
  detachPreviousScreen: false,
  presentation: 'modal',
  headerShown: false,
  cardStyle: {
    backgroundColor: 'transparent',
  },
  cardOverlayEnabled: true,
  cardShadowEnabled: false,

  cardStyleInterpolator: ({ current: { progress } }) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      }),
    },
  }),
};
