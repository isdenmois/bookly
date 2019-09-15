import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { color } from 'types/colors';
import { BookData } from 'store/book';
import { Button } from 'components/button';
import { Rating } from 'components/rating';

interface Props {
  openChangeStatus: () => void;
  book: BookData;
  style?: ViewStyle;
  ratingStyle?: TextStyle;
  testID?: string;
  status?: BOOK_STATUSES;
}

export function ReadButton(props: Props) {
  const status = props.book.status;

  if (status === BOOK_STATUSES.NOW) {
    return (
      <Button
        testID={props.testID}
        label='Сейчас читаю'
        icon={<Icon name='clock' size={18} color={color.Secondary} />}
        style={[props.style, s.orange]}
        textStyle={s.textOrange}
        onPress={props.openChangeStatus}
        thin
      />
    );
  }

  if (status === BOOK_STATUSES.READ) {
    return (
      <TouchableOpacity testID={props.testID} style={s.rating} onPress={props.openChangeStatus}>
        <Rating textStyle={props.ratingStyle} starSize={24} scale={5} value={props.book.rating} />
      </TouchableOpacity>
    );
  }

  return (
    <Button
      testID={props.testID}
      label={status === BOOK_STATUSES.WISH ? 'Хочу прочитать' : 'Добавить'}
      icon={<Icon name='bookmark' size={18} color={color.Primary} />}
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
    backgroundColor: color.OrangeBackground,
    marginTop: 10,
  } as ViewStyle,
  textOrange: {
    fontSize: 18,
    color: color.Secondary,
  } as TextStyle,
  green: {
    backgroundColor: color.Background,
    borderColor: color.Primary,
    borderWidth: 1,
    marginTop: 10,
  } as ViewStyle,
  textGreen: {
    fontSize: 18,
    color: color.Primary,
  } as TextStyle,
});
