import * as React from 'react';
import { Container, Header, Content, Card, CardItem, Body, Text, Button } from 'native-base';
import { StatusBar } from '../../components/StatusBar';

import { CurrentBook } from './components/CurrentBook';

export class HomeScreen extends React.Component<any> {
    static navigationOptions = () => ({header: null});

    render() {
        return (
            <Container>
                <StatusBar/>

                <Content>
                    <CurrentBook/>
                </Content>
            </Container>
        );
    }
}
