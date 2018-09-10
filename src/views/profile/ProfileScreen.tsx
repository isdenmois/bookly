import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Container, Header, Content, Card, CardItem, Body, Text, Button } from 'native-base';
import { setSessionId } from '../../modules/api/api';
import { StatusBar } from '../../components/StatusBar';

export class ProfileScreen extends React.Component<NavigationScreenProps> {
    render() {
        return (
            <Container>
                <StatusBar/>

                <Content>
                    <Button onPress={this.logout}>
                        <Text>Выйти</Text>
                    </Button>
                </Content>
            </Container>
        );
    }

    logout = () => {
        setSessionId(null);
        this.props.navigation.popToTop();
        this.props.navigation.replace('Login');
    }
}
