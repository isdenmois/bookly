import React from 'react';
import { ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { usePromise } from 'utils/use-observable';
import { database } from 'store';
import { ListItem, Checkbox } from 'components';
import List from 'store/list';

interface Props {
  bookLists: Set<string>;
  color: any;
  onChange: (lists: Set<string>) => void;
}

function getAllLists(): Promise<List[]> {
  return database.collections.get('lists').query().fetch() as any;
}

export function AddToList({ bookLists, color, onChange }) {
  const lists = usePromise(getAllLists, [], []);

  return lists.map(item => {
    const includes = bookLists.has(item.id);
    const toggle = () => {
      if (includes) {
        bookLists.delete(item.id);
      } else {
        bookLists.add(item.id);
      }

      onChange(new Set(bookLists));
    };

    return (
      <ListItem
        key={item.id}
        rowStyle={s.row}
        label={item.name}
        icon={<Icon name='list-ul' style={s.icon} size={20} color={color.PrimaryText} />}
        onPress={toggle}
      >
        <Checkbox value={includes} onValueChange={toggle} />
      </ListItem>
    );
  }) as any;
}

const s = {
  row: {
    paddingLeft: 5,
    justifyContent: 'space-between',
  } as ViewStyle,
  icon: {
    minWidth: 25,
  },
  switcher: {
    marginTop: 14,
    marginBottom: 10,
  } as ViewStyle,
};
