import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { light, dark } from 'types/colors';
import { BookData } from 'store/book';
import { Button } from 'components/button';
import { Rating } from 'components/rating';
import { t } from 'services';
import { useDynamicValue, DynamicStyleSheet, DynamicValue, useDarkModeContext } from 'react-native-dynamic';

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
  const mode = useDarkModeContext();
  const s = ds[mode];
  const color = mode === 'dark' ? dark : light;

  if (status === BOOK_STATUSES.NOW) {
    return (
      <Button
        testID={props.testID}
        label={t('button.current')}
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
      label={t(status === BOOK_STATUSES.WISH ? 'button.wish' : 'button.add')}
      icon={<Icon name='bookmark' size={18} color={color.Primary} />}
      style={[props.style, s.green]}
      textStyle={s.textGreen}
      onPress={props.openChangeStatus}
      thin
    />
  );
}

const ds = new DynamicStyleSheet({
  rating: {
    marginTop: 10,
  } as ViewStyle,
  orange: {
    backgroundColor: new DynamicValue(light.OrangeBackground, dark.OrangeBackground),
    marginTop: 10,
  },
  textOrange: {
    fontSize: 18,
    color: new DynamicValue(light.Secondary, dark.Secondary),
  },
  green: {
    backgroundColor: new DynamicValue(light.Background, dark.Background),
    color: new DynamicValue(light.Primary, dark.Primary),
    borderWidth: 1,
    marginTop: 10,
  },
  textGreen: {
    fontSize: 18,
    color: new DynamicValue(light.Primary, dark.Primary),
  },
});
