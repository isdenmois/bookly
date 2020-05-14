import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { color } from 'types/colors';
import { navigation } from 'services';
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

interface State {
  query: string;
  prevQuery: string;
  search: boolean;
}

export class ScreenHeader extends React.PureComponent<Props, State> {
  static contextType = ScrollToTopContext;

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
          placeholder='Поиск по названию'
          onChange={this.setQuery}
          onSearch={this.onSearch}
          onBack={goBack}
          onClose={this.clearSearch}
        />
      );
    }

    return (
      <View style={s.header}>
        <TouchIcon name='arrow-left' size={24} color={color.PrimaryText} onPress={goBack} onLongPress={goToHome} />
        <Text style={s.title} onPress={this.context.scroll}>
          {this.props.title}
        </Text>
        {this.props.onSearch && (
          <TouchIcon name='search' size={24} color={color.PrimaryText} onPress={this.openSearch} />
        )}
        {!this.props.onSearch && <View style={s.noSearch} />}
        {this.props.right && (
          <TouchIcon name={this.props.right} size={24} color={color.PrimaryText} onPress={this.props.onRight} />
        )}
      </View>
    );
  }

  setQuery = query => this.setState({ query });
  openSearch = () => this.setState({ search: true });
  closeSearch = () => this.setState({ search: false });
  clearSearch = () => this.props.onSearch('');
  onSearch = () => this.props.onSearch(this.state.query);
}

function goBack() {
  navigation.pop();
}

function goToHome() {
  navigation.popToTop();
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
