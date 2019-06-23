import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { BookData } from 'store/book';
import { Button } from 'components/button';
import { Rating } from 'components/rating';

interface Props {
  openChangeStatus: () => void;
  book: BookData;
  style?: ViewStyle;
  ratingStyle?: TextStyle;
}

export function ReadButton(props: Props) {
  const status = props.book.status;

  if (status === BOOK_STATUSES.NOW) {
    return (
      <Button
        label='Сейчас читаю'
        icon={<Icon name='clock' size={18} color='#F57C00' />}
        style={[props.style, s.orange]}
        textStyle={s.textOrange}
        onPress={props.openChangeStatus}
        thin
      />
    );
  }

  if (status === BOOK_STATUSES.READ) {
    return (
      <TouchableOpacity style={s.rating} onPress={props.openChangeStatus}>
        <Rating textStyle={props.ratingStyle} starSize={24} scale={5} value={props.book.rating} />
      </TouchableOpacity>
    );
  }

  return (
    <Button
      label='Хочу прочитать'
      icon={<Icon name='bookmark' size={18} color='#009688' />}
      style={[props.style, s.green]}
      textStyle={s.textGreen}
      onPress={props.openChangeStatus}
      thin
    />
  );
}
const s = StyleSheet.create({
  rating: {
    marginTop: 10,
  } as ViewStyle,
  orange: {
    backgroundColor: '#FFE0B2',
    marginTop: 10,
  } as ViewStyle,
  textOrange: {
    fontSize: 18,
    color: '#F57C00',
  } as TextStyle,
  green: {
    backgroundColor: 'white',
    borderColor: '#009688',
    borderWidth: 1,
    marginTop: 10,
  } as ViewStyle,
  textGreen: {
    fontSize: 18,
    color: '#009688',
  } as TextStyle,
});
