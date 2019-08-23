import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Alert,
  ToastAndroid,
  Insets,
} from 'react-native';
import { Model, Database } from '@nozbe/watermelondb';
import { color } from 'types/colors';
import { inject } from 'services';
import { ExpandableText } from 'components';

interface Props {
  description: string;
}

interface ViewListProps {
  title: string;
  value?: any;
  first?: boolean;
}

interface ViewListTouchableProps extends ViewListProps {
  onPress: () => void;
}

interface ViewLineModelRemoveProps {
  warning: string;
  model: Model;
}

const hitSlop: Insets = { top: 20, right: 20, bottom: 20, left: 20 };

export const BookDescriptionLine = (props: Props) => (
  <View style={s.descriptionRow}>
    <Text style={s.headerTitle}>ОПИСАНИЕ</Text>
    <ExpandableText>{props.description}</ExpandableText>
  </View>
);

export const ViewLine = (props: ViewListProps) => (
  <View style={props.first ? null : s.row}>
    <Text style={s.title}>{props.title}</Text>
    <Text style={s.value}>{props.value}</Text>
  </View>
);

export const ViewLineTouchable = (props: ViewListTouchableProps) => (
  <View style={props.first ? null : s.row}>
    <Text style={s.title}>{props.title}</Text>
    <TouchableOpacity onPress={props.onPress} style={s.value} hitSlop={hitSlop}>
      <Text style={s.value}>{props.value}</Text>
    </TouchableOpacity>
  </View>
);

export function ViewLineModelRemove(props: ViewLineModelRemoveProps) {
  const onPress = React.useCallback(() => confirmRemoveModel(props.model, props.warning), [props.model]);

  return (
    <View style={s.row}>
      <TouchableOpacity onPress={onPress} style={s.value} hitSlop={hitSlop}>
        <Text style={s.dangerousText}>{props.warning}</Text>
      </TouchableOpacity>
    </View>
  );
}

export function confirmRemoveModel(model: Model, warning: string) {
  Alert.alert('Удаление', `Вы действительно хотите ${warning.toLowerCase()}? Это действие нельзя отменить`, [
    { text: 'Отменить', style: 'cancel' },
    { text: 'OK', onPress: () => removeModel(model), style: 'destructive' },
  ]);
}

function removeModel(model: any) {
  inject(Database)
    .action(() => model.experimentalMarkAsDeleted())
    .then(() => ToastAndroid.show('Удалено из коллекции', ToastAndroid.LONG));
}

const s = StyleSheet.create({
  row: {
    marginVertical: 10,
  } as ViewStyle,
  descriptionRow: {
    marginVertical: 15,
  } as ViewStyle,
  title: {
    color: color.SecondaryText,
    fontSize: 12,
  } as TextStyle,
  headerTitle: {
    color: color.SecondaryText,
    fontSize: 14,
  } as TextStyle,
  value: {
    color: color.PrimaryText,
    fontSize: 18,
  } as TextStyle,
  dangerousText: {
    color: color.ErrorText,
    fontSize: 18,
  } as TextStyle,
});
