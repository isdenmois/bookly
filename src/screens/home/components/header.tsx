import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { SearchBar } from 'components/search-bar';
const { withNavigation } = require('react-navigation');

interface State {
  query: string;
}

@withNavigation
export class HomeHeader extends React.Component<Partial<NavigationScreenProps>, State> {
  state: State = { query: '' };

  render() {
    return (
      <SearchBar
        placeholder='Search books'
        value={this.state.query}
        onChange={this.queryChange}
        onSearch={this.onSearch}
      />
    );
  }

  queryChange = query => this.setState({ query });

  onSearch = () => {
    this.props.navigation.push('Search', { query: this.state.query.trim() });
    this.setState({ query: '' });
  };
}
