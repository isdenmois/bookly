import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface Props {
  description: string;
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
      <TouchableOpacity style={s.row} onPress={this.toggleExpand}>
        <Text style={s.title}>Описание</Text>
        <Text style={s.value} numberOfLines={this.state.expanded ? null : 3}>
          {this.props.description}
        </Text>
      </TouchableOpacity>
    );
  }
  toggleExpand = () => this.setState({ expanded: !this.state.expanded });
}

export function ViewLine({ title, value }) {
  return (
    <View style={s.row}>
      <Text style={s.title}>{title}</Text>
      <Text style={s.value}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    marginVertical: 10,
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
