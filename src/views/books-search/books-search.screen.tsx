import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import gql from 'graphql-tag'

import { Container, Content } from 'native-base'

import { color } from 'constants/colors'

import { StatusBar } from 'components/status-bar'
import { QueryList } from 'components/query-list'
import { FoundResults } from 'components/found-results'

import { SearchBar } from './components/search-bar'
import { BookSearchItem } from './components/book-search-item'
import { EmptyResult } from './components/empty-result'

interface Props extends NavigationScreenProps {
}

interface State {
  search: string
}

const LIMIT = 12

const SEARCH_BOOKS_QUERY = gql`
  query searchBooks($q: String!, $start: Int!, $count: Int!) {
    searchBooks(q: $q, start: $start, count: $count) {
      count
      books {
        id
        name
        authorName
        pic100
        userBookPartial {
          bookRead
          rating
        }
      }
    }
  }
`

export class BooksSearchScreen extends React.Component<Props, State> {
  static navigationOptions = () => ({header: null})

  state: State = {search: this.props.navigation.getParam('search')}

  render() {
    const variables = {q: this.state.search, start: 1, count: LIMIT}

    return (
      <Container>
        <StatusBar color={color.Green}/>

        <SearchBar navigation={this.props.navigation} value={this.state.search} onChange={this.onSearch}/>

        <Content>
          <QueryList query={SEARCH_BOOKS_QUERY}
                     variables={variables}
                     itemComponent={BookSearchItem}
                     emptyComponent={EmptyResult}
                     resultCountComponent={FoundResults}
                     request='searchBooks'
                     field='books'/>
        </Content>
      </Container>
    )
  }

  onSearch = search => this.setState({search})
}
