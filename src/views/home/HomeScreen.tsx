import * as React from 'react';
import { Button, View, Text } from 'react-native';

export class HomeScreen extends React.Component<any> {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Home Screen</Text>
                <Button
                    title='Go to Book'
                    onPress={() => this.props.navigation.navigate('Book', {bookId: 1})}
                />
            </View>
        );
    }
}
