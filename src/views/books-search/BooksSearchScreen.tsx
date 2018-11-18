import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import gql from 'graphql-tag'

import { Container, Content } from 'native-base'

import * as color from 'constants/colors'

import { StatusBar } from 'components/StatusBar'
import { QueryList } from 'components/QueryList'
import { FoundResults } from 'components/FoundResults'

import { SearchBar } from './components/SearchBar'
import { BookSearchItem } from './components/BookSearchItem'
import { EmptyResult } from './components/EmptyResult'

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
        <StatusBar color={color.green}/>

        <SearchBar value={this.state.search} onChange={this.onSearch}/>

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
