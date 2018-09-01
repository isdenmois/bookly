import * as React from 'react';
import { Button, View, Text } from 'react-native';

export class BookScreen extends React.Component<any> {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('otherParam', 'A Nested Details Screen'),
        };
    }

    render() {
        const bookId = this.props.navigation.getParam('bookId', 'NO-ID');

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Book Screen</Text>
                <Text>bookId: {JSON.stringify(bookId)}</Text>
                <Button
                    title='Go to Book... again'
                    onPress={() => this.props.navigation.navigate('Book', {bookId: 2})}
                />
                <Button
                    title='Go to Home'
                    onPress={() => this.props.navigation.navigate('Home')}
                />
                <Button
                    title='Go back'
                    onPress={() => this.props.navigation.goBack()}
                />
                <Button
                    title='Update the title'
                    onPress={() => this.props.navigation.setParams({otherParam: 'Updated!'})}
                />
            </View>
        );
    }
}
