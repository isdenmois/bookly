import * as React from 'react';
import { SafeAreaView } from 'react-navigation';
import { Container, Header, Content, Card, CardItem, Body, Text, Button } from 'native-base';
import { StatusBar } from '../../components/StatusBar';
import { TextS, TextM, TextL } from '../../components/Text';

import { CurrentBook } from './components/CurrentBook';

export class HomeScreen extends React.Component<any> {
    static navigationOptions = () => ({header: null});

    render() {
        return (
            <Container>
                <StatusBar/>

                <Content>
                    <CurrentBook/>

                    <Card>
                        <CardItem>
                            <Body>
                                <Button onPress={() => this.props.navigation.navigate('Book', {bookId: '1000454008'})}>
                                    <Text>Go to Book</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}
