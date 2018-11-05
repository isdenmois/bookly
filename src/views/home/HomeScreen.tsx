import * as React from 'react'
import { RefreshControl } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Body, Button, Card, CardItem, Container, Content, Text } from 'native-base'

import { gql, api } from 'modules/api/query'

import { SearchHeader } from './components/SearchHeader'
import { NavigationLinks } from './components/NavigationLinks'
import { CurrentBook } from './components/CurrentBook'
import { BookChallenge } from './components/BookChallenge'

interface Props extends NavigationScreenProps {
  refresh?: () => void
  loading?: boolean
  isLoaded?: boolean
  user_challenge?: any
  userBooks?: any
}

interface State {
  isLoaded: boolean;
  refreshing: boolean;
}

@api({
  query: gql`
    query {
      user_challenge {
        user_challenge {
          count_books_read
          count_books_total
          count_books_forecast
        }
      }

      userBooks(params: ["start", "count"]) {
        id
        author_name
        name
        pic_100
        user_book_partial {
          book_read
        }
      }
    }
  `,
  params: mapParams,
})
export class HomeScreen extends React.Component<Props, State> {
  static navigationOptions = () => ({header: null})

  getRefresh() {
    return <RefreshControl refreshing={this.props.loading} onRefresh={this.props.refresh}/>
  }

  render() {
    return (
      <Container>
        <SearchHeader/>

        <Content refreshControl={this.getRefresh()}>
          {this.props.isLoaded &&
            <CurrentBook navigation={this.props.navigation} books={this.props.userBooks}/>
          }

          {this.props.isLoaded && this.props.user_challenge &&
            <BookChallenge challenge={this.props.user_challenge}/>
          }

          {__DEV__ &&
           <Card>
             <CardItem>
               <Body>
               <Button onPress={() => this.props.navigation.navigate('Book', {bookId: '1000454008'})}>
                 <Text>open some Book</Text>
               </Button>
               </Body>
             </CardItem>
           </Card>
          }

          <NavigationLinks navigation={this.props.navigation}/>
        </Content>
      </Container>
    )
  }
}

function mapParams(props, params, session) {
  return {
    user: session.userId,
    type: 'wish',
    start: 1,
    count: 24,
    year: currentYear(),
  }
}

function currentYear() {
  return new Date().getFullYear()
}
