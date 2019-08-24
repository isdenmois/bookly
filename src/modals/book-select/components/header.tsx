import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { color } from 'types/colors';
import { SearchBar, TouchIcon } from 'components';

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
        {!opened && (
          <Text style={s.title} numberOfLines={1}>
            {title}
          </Text>
        )}
        {!opened && <TouchIcon name='search' size={20} onPress={this.openSearch} color={color.SecondaryText} />}
        {opened && (
          <SearchBar
            autoFocus
            style={s.searchBar}
            value={value}
            onChange={this.setValue}
            onSearch={this.search}
            onClose={this.search}
          />
        )}
      </View>
    );
  }

  openSearch = () => this.setState({ opened: true });
  setValue = value => this.setState({ value });
  search = () => {
    this.setState({ opened: false });

    if (this.props.search !== this.state.value) {
      this.props.onChange(this.state.value);
    }
  };
}

const s = StyleSheet.create({
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
    fontFamily: 'sans-serif-medium',
    color: color.PrimaryText,
    paddingVertical: 12,
  } as TextStyle,
});
