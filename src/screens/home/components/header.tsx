import React from 'react';
import { Navigation, inject } from 'services';
import { SearchBar } from 'components';

interface State {
  query: string;
}

export class HomeHeader extends React.Component<any, State> {
  state: State = { query: '' };

  render() {
    return (
      <SearchBar
        placeholder='Поиск по FantLab'
        value={this.state.query}
        onChange={this.queryChange}
        onSearch={this.onSearch}
      />
    );
  }

  queryChange = query => this.setState({ query });

  onSearch = () => {
    inject(Navigation).push('Search', { query: this.state.query.trim() });
    this.setState({ query: '' });
  };
}
