import React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { NavigationScreenProps } from 'react-navigation';
import { Database } from '@nozbe/watermelondb';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Button } from 'components/button';
import { TextM } from 'components/text';
import { wishBooksQuery } from '../home.service';
const { withNavigation } = require('react-navigation');

interface Props extends Partial<NavigationScreenProps> {
  database: Database;
  wishBooksCount?: number;
}

@withNavigation
@withObservables([], ({ database }) => ({
  wishBooksCount: wishBooksQuery(database).observeCount(),
}))
export class EmptyBook extends React.Component<Props> {
  render() {
    const { wishBooksCount } = this.props;
    return (
      <View style={s.container}>
        <Icon name='bookmark' size={36} color='#90A4AE' />
        {!wishBooksCount && <TextM style={s.text}>Нет текущей читаемой книги</TextM>}
        {!!wishBooksCount && <TextM style={s.text}>Выберите книгу, которую сейчас читаете</TextM>}
        {!!wishBooksCount && <Button onPress={this.openBookSelect} style={s.button} label='Выбрать книгу' />}
      </View>
    );
  }

  openBookSelect = () => this.props.navigation.navigate('/modal/book-select');
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 35,
  } as ViewStyle,
  text: {
    color: '#90A4AE',
    marginTop: 25,
    textAlign: 'center',
  } as TextStyle,
  button: {
    marginTop: 25,
  } as ViewStyle,
});
