import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { color } from 'types/colors';
import { TouchIcon } from './touch-icon';
import { SearchBar } from './search-bar';

interface Props extends NavigationScreenProps {
  title: string;
  query?: string;
  onSearch?: (value: string) => void;
}

interface State {
  query: string;
  prevQuery: string;
  search: boolean;
}

export class ScreenHeader extends React.PureComponent<Props, State> {
  state = { search: false, query: '', prevQuery: '' };

  static getDerivedStateFromProps(props: Props, state: State): State {
    if (!state || state.prevQuery !== props.query) {
      return { query: props.query, prevQuery: props.query, search: false };
    }

    return null;
  }

  render() {
    if (this.state.search) {
      return (
        <SearchBar
          autoFocus
          style={s.searchHeader}
          value={this.state.query}
          onChange={this.setQuery}
          onSearch={this.onSearch}
          onBack={this.goBack}
          onClose={this.clearSearch}
        />
      );
    }

    return (
      <View style={s.header}>
        <TouchIcon name='arrow-left' size={24} color={color.PrimaryText} onPress={this.goBack} />
        <Text style={s.title}>{this.props.title}</Text>
        {this.props.onSearch && (
          <TouchIcon name='search' size={24} color={color.PrimaryText} onPress={this.openSearch} />
        )}
        {!this.props.onSearch && <View style={s.noSearch} />}
      </View>
    );
  }

  goBack = () => this.props.navigation.pop();
  setQuery = query => this.setState({ query });
  openSearch = () => this.setState({ search: true });
  closeSearch = () => this.setState({ search: false });
  clearSearch = () => this.props.onSearch('');
  onSearch = () => this.props.onSearch(this.state.query);
}

const s = StyleSheet.create({
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
    color: color.PrimaryText,
    marginLeft: 20,
  } as TextStyle,
  noSearch: {
    width: 24,
    height: 25,
  } as ViewStyle,
});
