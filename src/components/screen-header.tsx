import React, { memo, useContext, useState, useCallback, useEffect } from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { DynamicStyleSheet } from 'react-native-dynamic';
import { useSColor, dynamicColor } from 'types/colors';
import { navigation, t } from 'services';
import { ScrollToTopContext } from 'utils/scroll-to-top';
import { TouchIcon } from './touch-icon';
import { SearchBar } from './search-bar';

interface Props {
  title: string;
  query?: string;
  right?: string;
  onRight?: () => void;
  onSearch?: (value: string) => void;
}

export const ScreenHeader = memo((props: Props) => {
  const { scroll } = useContext(ScrollToTopContext);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  const { s, color } = useSColor(ds);

  useEffect(() => {
    setQuery(props.query);
    setSearch(false);
  }, [props.query]);

  const openSearch = useCallback(() => setSearch(true), []);
  const clearSearch = useCallback(() => props.onSearch(''), []);
  const onSearch = useCallback(() => props.onSearch(query), [query]);

  if (search) {
    return (
      <SearchBar
        autoFocus
        style={s.searchHeader}
        value={query}
        placeholder={t('common.search-by-title')}
        onChange={setQuery}
        onSearch={onSearch}
        onBack={goBack}
        onClose={clearSearch}
      />
    );
  }

  return (
    <View style={s.header}>
      <TouchIcon name='arrow-left' size={24} color={color.PrimaryText} onPress={goBack} onLongPress={goToHome} />
      <Text style={s.title} onPress={scroll}>
        {t(props.title)}
      </Text>
      {props.onSearch && <TouchIcon name='search' size={24} color={color.PrimaryText} onPress={openSearch} />}
      {!props.onSearch && <View style={s.noSearch} />}
      {props.right && <TouchIcon name={props.right} size={24} color={color.PrimaryText} onPress={props.onRight} />}
    </View>
  );
});

function goBack() {
  navigation.pop();
}

function goToHome() {
  navigation.popToTop();
}

const ds = new DynamicStyleSheet({
  searchHeader: {
    marginVertical: 5,
    marginHorizontal: 5,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  } as ViewStyle,
  title: {
    flex: 1,
    marginRight: 44,
    fontSize: 24,
    textAlign: 'center',
    color: dynamicColor.PrimaryText,
    marginLeft: 20,
  } as TextStyle,
  noSearch: {
    width: 24,
    height: 25,
  } as ViewStyle,
});
