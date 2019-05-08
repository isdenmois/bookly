import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { State, Store } from '@sambego/storybook-state';
import { Alert, StyleSheet, View } from 'react-native';
import { SearchBar } from './search-bar';

const store = new Store({
  text: '',
});

storiesOf('SearchBar').add('Usage', () => (
  <State store={store}>
    {state => (
      <View style={s.centered}>
        <View style={s.row}>
          <SearchBar
            placeholder='Поиск книг'
            value={state.text}
            onChange={text => store.set({ text })}
            onSearch={onSearch}
          />
        </View>

        <View style={s.row}>
          <SearchBar value={state.text} onChange={text => store.set({ text })} onSearch={onSearch} onBack={onBack} />
        </View>
      </View>
    )}
  </State>
));

function onSearch(text) {
  Alert.alert(`search: "${text}"`);
}

function onBack() {
  Alert.alert('назад!');
}

const s = StyleSheet.create({
  centered: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  row: {
    marginBottom: 10,
  },
});
