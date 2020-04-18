import React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import withObservables from '@nozbe/with-observables';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color } from 'types/colors';
import { navigation } from 'services';
import { Button, TextM } from 'components';
import { wishBooksQuery } from '../home.queries';

interface Props {
  wishBooksCount?: number;
}

const withWishBooksCount: Function = withObservables(null, () => ({
  wishBooksCount: wishBooksQuery().observeCount(),
}));

@withWishBooksCount
export class EmptyBook extends React.Component<Props> {
  render() {
    const { wishBooksCount } = this.props;
    return (
      <View style={s.container}>
        <Icon name='bookmark' size={36} color={color.Empty} />
        {!wishBooksCount && <TextM style={s.text}>Нет текущей читаемой книги</TextM>}
        {!!wishBooksCount && <TextM style={s.text}>Выберите книгу, которую сейчас читаете</TextM>}
        {!!wishBooksCount && (
          <Button testID='BookSelectButton' onPress={this.openBookSelect} style={s.button} label='Выбрать книгу' />
        )}
      </View>
    );
  }

  openBookSelect = () => navigation.navigate('/modal/book-select');
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 35,
  } as ViewStyle,
  text: {
    color: color.Empty,
    marginTop: 25,
    textAlign: 'center',
  } as TextStyle,
  button: {
    marginTop: 25,
  } as ViewStyle,
});
