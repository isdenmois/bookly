import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, Alert, ToastAndroid } from 'react-native';
import { Model, Database } from '@nozbe/watermelondb';
import { color } from 'types/colors';
import { inject, Navigation } from 'services';

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

interface State {
  expanded: boolean;
}

export class BookDescriptionLine extends React.Component<Props, State> {
  state: State = {
    expanded: false,
  };

  render() {
    return (
      <View style={s.descriptionRow}>
        <Text style={s.headerTitle}>ОПИСАНИЕ</Text>
        <Text style={s.value} numberOfLines={this.state.expanded ? null : 3}>
          {this.props.description}
        </Text>

        <TouchableOpacity onPress={this.toggleExpand}>
          <Text style={s.toggleText}>{this.state.expanded ? 'Свернуть' : 'Читать далее'}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  toggleExpand = () => this.setState({ expanded: !this.state.expanded });
}

export function ViewLine(props: ViewListProps) {
  return (
    <View style={props.first ? null : s.row}>
      <Text style={s.title}>{props.title}</Text>
      <Text style={s.value}>{props.value}</Text>
    </View>
  );
}

export function ViewLineTouchable(props: ViewListTouchableProps) {
  return (
    <View style={props.first ? null : s.row}>
      <Text style={s.title}>{props.title}</Text>
      <TouchableOpacity onPress={props.onPress} style={s.value}>
        <Text style={s.value}>{props.value}</Text>
      </TouchableOpacity>
    </View>
  );
}

export function ViewLineModelRemove(props: ViewLineModelRemoveProps) {
  const onPress = React.useCallback(() => confirmRemoveModel(props.model, props.warning), [props.model]);

  return (
    <View style={s.row}>
      <TouchableOpacity onPress={onPress} style={s.value}>
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
  toggleText: {
    paddingVertical: 5,
    textAlign: 'right',
    color: color.ReadMore,
  } as TextStyle,
  dangerousText: {
    color: color.ErrorText,
    fontSize: 18,
  } as TextStyle,
});
