import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Container, Header, Content, Card, CardItem, Body, Text, Button } from 'native-base';
import { StatusBar } from '../../components/StatusBar';
import { NavigationLinks } from './components/NavigationLinks';

import { CurrentBook } from './components/CurrentBook';

export class HomeScreen extends React.Component<NavigationScreenProps> {
    static navigationOptions = () => ({header: null});

    render() {
        return (
            <Container>
                <StatusBar/>

                <Content>
                    <CurrentBook navigation={this.props.navigation}/>

                    <Card>
                        <CardItem>
                            <Body>
                                <Button onPress={() => this.props.navigation.navigate('Book', {bookId: '1000454008'})}>
                                    <Text>Go to Book</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>

                    <NavigationLinks navigation={this.props.navigation}/>
                </Content>
            </Container>
        );
    }
}
