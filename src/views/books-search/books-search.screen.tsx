import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'

import { Container, Content } from 'native-base'

import { color } from 'constants/colors'

import { FantlabWork, searchBooks } from 'api/fantlab'

import { StatusBar } from 'components/status-bar'

import { SearchBar } from './components/search-bar'
import { BookSearchItem } from './components/book-search-item'
import { EmptyResult } from './components/empty-result'
import { WorkList } from 'components/work-list'

interface Props extends NavigationScreenProps {
}

interface State {
  query: string
  loading: boolean
  books: FantlabWork[]
}

export class BooksSearchScreen extends React.Component<Props, State> {
  static navigationOptions = () => ({header: null})

  state: State = {
    query: this.props.navigation.getParam('query'),
    loading: true,
    books: null,
  }

  constructor(props) {
    super(props)

    this.search(this.state.query)
  }

  render() {
    return (
      <Container>
        <StatusBar color={color.Green}/>

        <SearchBar navigation={this.props.navigation} value={this.state.query} onChange={this.search}/>

        <Content>
          <WorkList loading={this.state.loading}
                    books={this.state.books}
                    itemComponent={BookSearchItem}
                    emptyComponent={EmptyResult}/>
        </Content>
      </Container>
    )
  }

  search = async query => {
    if (!query) {
      return this.setState({query})
    }

    this.setState({query, loading: true})

    try {
      const books = await searchBooks(query)

      this.setState({books, loading: false})
    } catch (e) {
      this.setState({books: [], loading: false})
    }
  }
}
