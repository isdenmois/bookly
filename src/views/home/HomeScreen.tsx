import * as React from 'react'
import { RefreshControl } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Body, Button, Card, CardItem, Container, Content, Text } from 'native-base'

import { api } from 'modules/api/query'

import { SearchHeader } from './components/SearchHeader'
import { NavigationLinks } from './components/NavigationLinks'
import { CurrentBook } from './components/CurrentBook'
import { BookChallenge } from './components/BookChallenge'
import { HOME_SCREEN_QUERY } from './userBooksFragement'
import { client } from 'services/apollo-client-bridge'

interface Props extends NavigationScreenProps {
  refetch?: () => void
  loading?: boolean
  isLoaded?: boolean
  userChallenge?: any
  userBooks?: any
}

interface State {
  isLoaded: boolean;
  refreshing: boolean;
}

@api(HOME_SCREEN_QUERY, mapParams)
export class HomeScreen extends React.Component<Props, State> {
  static navigationOptions = () => ({header: null})

  getRefresh() {
    return <RefreshControl refreshing={this.props.loading} onRefresh={() => client.reFetchObservableQueries()}/>
  }

  render() {
    return (
      <Container>
        <SearchHeader/>

        <Content refreshControl={this.getRefresh()}>
          {!this.props.loading &&
            <CurrentBook navigation={this.props.navigation} books={this.props.userBooks}/>
          }

          {!this.props.loading && this.props.userChallenge &&
            <BookChallenge challenge={this.props.userChallenge}/>
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

function mapParams(props, session) {
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
