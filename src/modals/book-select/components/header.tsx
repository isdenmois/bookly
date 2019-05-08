import React from 'react';
import { StyleSheet, Text, View, TextInput, ViewStyle, TextStyle } from 'react-native';
import { TouchIcon } from 'components/touch-icon';
import { SearchBar } from 'components/search-bar';

interface Props {
  search: string;
  onChange: (search: string) => void;
}

interface State {
  search: string;
  value: string;
  opened: boolean;
}

export class BookSelectHeader extends React.Component<Props, State> {
  static getDerivedStateFromProps(props, state) {
    if (!state || props.search !== state.search) {
      return {
        search: props.search,
        value: props.search,
        opened: !!state && state.opened,
      };
    }

    return null;
  }

  state = { search: '', value: '', opened: false };

  render() {
    const { opened, value, search } = this.state;
    const title = search || 'Выбрать книгу';

    return (
      <View style={s.container}>
        {!opened && <Text style={s.title}>{title}</Text>}
        {!opened && <TouchIcon style={s.searchIcon} name='search' size={24} onPress={this.openSearch} />}
        {opened && (
          <SearchBar autoFocus style={s.searchBar} value={value} onChange={this.setValue} onSearch={this.search} />
        )}
      </View>
    );
  }

  openSearch = () => this.setState({ opened: true });
  setValue = value => this.setState({ value });
  search = () => {
    this.setState({ opened: false });
    this.props.onChange(this.state.value);
  };
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 0.5,
    alignItems: 'center',
  } as ViewStyle,
  searchIcon: {
    paddingHorizontal: 10,
  } as ViewStyle,
  searchBar: {
    flex: 1,
    marginHorizontal: 10,
    height: 40,
    marginTop: 10,
    marginBottom: 5,
  } as ViewStyle,
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'sans-serif-medium',
    color: 'black',
    textAlign: 'center',
    paddingVertical: 12,
  } as TextStyle,
});
