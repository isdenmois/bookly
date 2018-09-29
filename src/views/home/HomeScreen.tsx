import * as React from 'react'
import { RefreshControl, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { inject, observer } from 'mobx-react'
import { Body, Button, Card, CardItem, Container, Content, Text } from 'native-base'

import { StatusBar } from '../../components/StatusBar'
import { SearchHeader } from './components/SearchHeader';
import { NavigationLinks } from './components/NavigationLinks'
import { CurrentBook } from './components/CurrentBook'
import { HomeStore } from './services/HomeStore'
import { BookChallenge } from './components/BookChallenge'

interface Props extends NavigationScreenProps {
  homeStore: HomeStore
}

interface State {
  isLoaded: boolean;
  refreshing: boolean;
}

@inject('homeStore')
@observer
export class HomeScreen extends React.Component<Props, State> {
  static navigationOptions = () => ({header: null})

  state: State = {
    isLoaded: false,
    refreshing: true,
  }

  componentWillMount() {
    this.loadData()
  }

  getRefresh() {
    return <RefreshControl refreshing={this.state.refreshing} onRefresh={this.loadData}/>
  }

  render() {
    return (
      <Container>
        <SearchHeader/>

        <Content refreshControl={this.getRefresh()}>
          {this.state.isLoaded &&
            <CurrentBook navigation={this.props.navigation}/>
          }

          {this.state.isLoaded && this.props.homeStore.challenge &&
            <BookChallenge challenge={this.props.homeStore.challenge}/>
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

  loadData = () => {
    const promises = [
      this.props.homeStore.loadCurrentBooks(),
      this.props.homeStore.loadCurrentChallenge(),
    ]

    this.setState({refreshing: true})

    return Promise.all(promises)
      .then(() => this.setState({refreshing: false, isLoaded: true}))
  }
}
