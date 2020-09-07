import React from 'react';
import { View, ViewStyle, TextStyle, Platform, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { DynamicStyleSheet } from 'react-native-dynamic';
import { dynamicColor, useSColor } from 'types/colors';
import { t } from 'services';
import { database } from 'store';
import { Button, ScreenHeader, ListItem, Screen } from 'components';
import { useObservable } from 'utils/use-observable';
import { Observable } from 'rxjs';
import List from 'store/list';

function getLists(): Observable<List[]> {
  return database.collections.get('lists').query().observeWithColumns(['name']) as any;
}

export function ListsScreen({ navigation }) {
  const { s, color } = useSColor(ds);
  const lists = useObservable(getLists, [], []);
  const addList = () => navigation.navigate('/modal/list-add');

  return (
    <Screen>
      <ScreenHeader title='headers.lists' />

      <FlatList
        contentContainerStyle={s.content}
        data={lists}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItem
            label={item.name}
            onPress={() => navigation.push('WishList', { listId: item.id, listName: item.name })}
            onLongPress={() => navigation.navigate('/modal/list-edit', { list: item })}
          />
        )}
      />

      <View style={s.buttonContainer}>
        <Button
          label={t('button.add')}
          onPress={addList}
          icon={<Icon name='plus' size={18} color={color.PrimaryText} />}
          style={s.button}
          textStyle={s.buttonText}
        />
      </View>
    </Screen>
  );
}

const ds = new DynamicStyleSheet({
  content: {
    paddingHorizontal: 15,
    paddingBottom: 70,
  } as ViewStyle,
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
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
});
