import React from 'react';
import _ from 'lodash';
import { Text, TouchableOpacity, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color } from 'types/colors';

interface Props {
  title: string;
  fields: any[];
  value: string;
  labelKey: string;
  onChange: (id: string) => void;
  onClose: () => void;
}

export class SelectList extends React.PureComponent<Props> {
  render() {
    return (
      <View style={s.container}>
        <View style={s.headerRow}>
          <TouchableOpacity onPress={this.props.onClose}>
            <Text style={s.title}>{this.props.title}</Text>
          </TouchableOpacity>
          {this.props.children}
        </View>
        {this.renderList()}
      </View>
    );
  }

  renderList() {
    const { fields, value } = this.props;
    const labelKey = this.props.labelKey || 'label';

    return _.map(fields, field => (
      <TouchableOpacity key={field.id} style={s.row} onPress={() => this.props.onChange(field.id)}>
        <Icon name={value === field.id ? 'check-circle' : 'circle'} size={18} color={color.PrimaryText} />
        <Text style={s.optionText}>{field[labelKey]}</Text>
      </TouchableOpacity>
    ));
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    marginBottom: 10,
  } as ViewStyle,
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  } as ViewStyle,
  title: {
    fontSize: 16,
    color: color.PrimaryText,
    paddingVertical: 15,
  } as TextStyle,
  optionText: {
    color: color.PrimaryText,
    fontSize: 14,
    marginLeft: 10,
  } as TextStyle,
});
