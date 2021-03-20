import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen } from 'screens/home/home.screen';
import { ReadListScreen } from 'screens/book-list/read-list.screen';
import { WishListScreen } from 'screens/book-list/wish-list.screen';
import { ProfileScreen } from 'screens/profile/profile.screen';
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
    <Stack.Navigator
      screenOptions={{
        headerTintColor: color.PrimaryText,
        headerBackImage,
        cardStyle: { flex: 1, backgroundColor: color.Background },
      }}
    >
      <Stack.Screen name={MainRoutes.Home} component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name={MainRoutes.Profile} component={ProfileScreen} />
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
      <Stack.Screen name={MainRoutes.Settings} component={SettingsScreen} />
      <Stack.Screen name={MainRoutes.Lists} component={ListsScreen} options={{ headerTitle: t('headers.lists') }} />
    </Stack.Navigator>
  );
}
