import * as _ from 'lodash'
import * as React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

import { Button, Container, Content } from 'native-base'
import { SearchBar } from './components/SearchBar'

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
        author_name
        pic_100
        user_book_partial {
          book_read
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
        <SearchBar value={this.state.search} onChange={this.onSearch}/>

        <Content>
          <Query query={SEARCH_BOOKS_QUERY} variables={variables} fetchPolicy='cache-and-network'>
            {this.renderList}
          </Query>
        </Content>
      </Container>
    )
  }

  renderList = ({ loading, data, fetchMore }) => {
    if (loading && !_.has(data, 'searchBooks.books')) return <ActivityIndicator size='large'/>
    if (!loading && _.isEmpty(data.searchBooks)) return <Text>Нет монет</Text>

    return (
      <View>
        {_.map(data.searchBooks.books, book => <Text key={book.id}>{book.name}</Text>)}

        {loading && <ActivityIndicator size='large'/>}
        {!loading && this.renderFetchMore(fetchMore, data.searchBooks)}
      </View>
    )
  }

  renderFetchMore(fetchMore, data) {
    if (_.size(data.books) >= data.count) return null

    return (
      <Button full onPress={() => this.fetchMoreParams(fetchMore, _.size(data.books) + 1)}>
        <Text>Загрузить еще</Text>
      </Button>
    )
  }

  fetchMoreParams = (fetchMore, start) => fetchMore({
    variables: {start},
    updateQuery: updateQueryList('searchBooks', 'books'),
  })

  onSearch = search => this.setState({search})
}

function updateQueryList(request, field) {
  return function (prev, { fetchMoreResult }) {
    return Object.assign({}, prev, {
      [request]: {
        count: prev[request].count,
        [field]: [...prev[request][field], ...fetchMoreResult[request][field]],
        __typename: prev[request].__typename,
      },
    })
  }
}
