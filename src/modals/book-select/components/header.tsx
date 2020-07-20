import React, { useState, useCallback, useEffect } from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native';
import { useSColor, dynamicColor, boldText } from 'types/colors';
import { SearchBar, TouchIcon } from 'components';
import { t } from 'services';
import { DynamicStyleSheet } from 'react-native-dynamic';

interface Props {
  search: string;
  onChange: (search: string) => void;
}

interface State {
  search: string;
  value: string;
  opened: boolean;
}

export function BookSelectHeader(props: Props) {
  const { s, color } = useSColor(ds);
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState('');
  const openSearch = useCallback(() => setOpened(true), []);
  const toSearch = useCallback(() => {
    setOpened(false);

    if (props.search !== value) {
      props.onChange(value);
    }
  }, [value, props.search]);

  useEffect(() => {
    setValue(props.search);
  }, [props.search]);

  const title = props.search || t('modal.select-book');

  return (
    <View style={s.container}>
      {!opened && (
        <Text style={s.title} numberOfLines={1}>
          {title}
        </Text>
      )}
      {!opened && <TouchIcon name='search' size={20} onPress={openSearch} color={color.SecondaryText} />}
      {opened && (
        <SearchBar
          autoFocus
          style={s.searchBar}
          value={value}
          onChange={setValue}
          onSearch={toSearch}
          onClose={toSearch}
        />
      )}
    </View>
  );
}

const ds = new DynamicStyleSheet({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  } as ViewStyle,
  searchBar: {
    flex: 1,
    height: 40,
    marginTop: 10,
  } as ViewStyle,
  title: {
    flex: 1,
    fontSize: 20,
    color: dynamicColor.PrimaryText,
    paddingVertical: 12,
    ...boldText,
  } as TextStyle,
});
