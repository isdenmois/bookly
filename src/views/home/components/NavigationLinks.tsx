import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { List, ListItem } from 'native-base';
import { TextM } from '../../../components/Text';
import { notImplemented } from '../../../constants/not-implemented-yet';

export class NavigationLinks extends React.Component<NavigationScreenProps> {
    render() {
        return (
            <List>
                <ListItem onPress={notImplemented}>
                    <TextM>Прочитано</TextM>
                </ListItem>
                <ListItem onPress={notImplemented}>
                    <TextM>Хочу прочитать</TextM>
                </ListItem>
                <ListItem onPress={notImplemented}>
                    <TextM>Синхронизация</TextM>
                </ListItem>
                <ListItem onPress={this.openProfile}>
                    <TextM>Профиль</TextM>
                </ListItem>
            </List>
        );
    }

    openProfile = () => {
        this.props.navigation.push('Profile');
    }
}
