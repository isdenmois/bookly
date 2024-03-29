import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Alert,
  ToastAndroid,
  Insets,
  Platform,
} from 'react-native';
import { Model } from '@nozbe/watermelondb';
import { dynamicColor } from 'types/colors';
import { database } from 'store';
import { t } from 'services';
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dynamic';
import { Checkbox } from 'components';

interface Props {
  description: string;
}

interface ViewListProps {
  title: string | number;
  value?: any;
}

interface ViewListTouchableProps extends ViewListProps {
  onPress?: () => void;
  onLongPress?: () => void;
}

interface ViewLineModelRemoveProps {
  warning: string;
  model: Model;
}

interface ViewLineActionProps {
  title: string;
  onPress?: () => void;
  onLongPress?: () => void;
}

interface ViewMultilineProps {
  title: string;
  items: string[];
  onPress?: (item: string) => void;
}

const hitSlop: Insets = { top: 20, right: 20, bottom: 20, left: 20 };

export const BookDescriptionLine = (props: Props) => {
  const s = useDynamicStyleSheet(ds);

  return (
    <View style={s.descriptionRow}>
      <Text style={s.headerTitle}>{t('details.desc')}</Text>
      <Text style={s.value}>{props.description}</Text>
    </View>
  );
};

export const ViewLine = (props: ViewListProps) => {
  const s = useDynamicStyleSheet(ds);

  return (
    <View style={s.row}>
      <Text style={s.title}>{props.title}</Text>
      <Text style={s.value}>{props.value}</Text>
    </View>
  );
};

export const ViewLineCheckbox = ({ title, value, onToggle }) => {
  const s = useDynamicStyleSheet(ds);

  return (
    <TouchableOpacity style={s.checkboxRow} onPress={onToggle}>
      <Text style={s.value}>{title}</Text>
      <Checkbox value={value} onValueChange={onToggle} />
    </TouchableOpacity>
  );
};

export const ViewLineTouchable = (props: ViewListTouchableProps) => {
  const s = useDynamicStyleSheet(ds);

  return (
    <View style={s.row}>
      <Text style={s.title}>{props.title}</Text>
      <TouchableOpacity onPress={props.onPress} onLongPress={props.onLongPress} style={s.value} hitSlop={hitSlop}>
        <Text style={s.value}>{props.value}</Text>
      </TouchableOpacity>
    </View>
  );
};

export function ViewLineModelRemove(props: ViewLineModelRemoveProps) {
  const s = useDynamicStyleSheet(ds);
  const onPress = () => confirmRemoveModel(props.model, props.warning);

  return (
    <View style={s.row}>
      <TouchableOpacity onPress={onPress} style={s.value} hitSlop={hitSlop}>
        <Text style={s.dangerousText}>{props.warning}</Text>
      </TouchableOpacity>
    </View>
  );
}

export function ViewLineAction({ title, onPress, onLongPress }: ViewLineActionProps) {
  const s = useDynamicStyleSheet(ds);

  return (
    <View style={s.row}>
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress} style={s.value} hitSlop={hitSlop}>
        <Text style={s.actionText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

export function ViewMultiline({ title, items, onPress }: ViewMultilineProps) {
  const s = useDynamicStyleSheet(ds);

  return (
    <View style={s.row}>
      <Text style={s.title}>{title}</Text>

      {items.map(item => (
        <TouchableOpacity key={item} onPress={() => onPress(item)} style={s.value}>
          <Text style={s.value}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function confirm(title: string, message?: string) {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'web') {
      const fn = window.confirm(message || title) ? resolve : reject;

      return fn();
    }

    Alert.alert(message ? title : null, message || title, [
      { text: 'Отменить', style: 'cancel', onPress: reject },
      { text: 'OK', onPress: resolve, style: 'destructive' },
    ]);
  });
}

export function confirmRemoveModel(model: Model, warning: string) {
  confirm('Удаление', `Вы действительно хотите ${warning.toLowerCase()}? Это действие нельзя отменить`).then(() =>
    removeModel(model),
  );
}

function removeModel(model: any) {
  database.write(() => model.markAsDeleted()).then(() => ToastAndroid.show('Удалено из коллекции', ToastAndroid.LONG));
}

const ds = new DynamicStyleSheet({
  row: {
    marginBottom: 20,
  } as ViewStyle,
  checkboxRow: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  descriptionRow: {
    marginTop: 10,
    marginBottom: 20,
  } as ViewStyle,
  title: {
    color: dynamicColor.SecondaryText,
    fontSize: 12,
  } as TextStyle,
  headerTitle: {
    color: dynamicColor.SecondaryText,
    fontSize: 14,
    marginBottom: 10,
  } as TextStyle,
  value: {
    color: dynamicColor.PrimaryText,
    fontSize: 18,
  } as TextStyle,
  dangerousText: {
    color: dynamicColor.ErrorText,
    fontSize: 18,
  } as TextStyle,
  actionText: {
    color: dynamicColor.BlueIcon,
    fontSize: 18,
  } as TextStyle,
});
