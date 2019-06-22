import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';

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

interface State {
  expanded: boolean;
}

export class BookDescriptionLine extends React.Component<Props, State> {
  state: State = {
    expanded: false,
  };

  render() {
    return (
      <TouchableOpacity style={s.descriptionRow} onPress={this.toggleExpand}>
        <Text style={s.title}>ОПИСАНИЕ</Text>
        <Text style={s.value} numberOfLines={this.state.expanded ? null : 3}>
          {this.props.description}
        </Text>
      </TouchableOpacity>
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

const s = StyleSheet.create({
  row: {
    marginVertical: 10,
  } as ViewStyle,
  descriptionRow: {
    marginVertical: 15,
  } as ViewStyle,
  title: {
    color: '#757575',
    fontSize: 12,
  } as TextStyle,
  value: {
    color: 'black',
    fontSize: 18,
  } as TextStyle,
});