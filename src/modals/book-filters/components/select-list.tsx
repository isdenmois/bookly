import React from 'react';
import _ from 'lodash';
import { Text, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getColor, dynamicColor } from 'types/colors';
import { ColorSchemeContext, DynamicStyleSheet } from 'react-native-dynamic';
import { t } from 'services';

interface Props {
  title: string;
  fields: any[];
  value: string;
  labelKey: string;
  onChange: (id: string) => void;
  onClose: () => void;
}

export class SelectList extends React.PureComponent<Props> {
  static contextType = ColorSchemeContext;

  render() {
    const s = ds[this.context];

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
    const s = ds[this.context];
    const color = getColor(this.context);

    return _.map(fields, field => (
      <TouchableOpacity key={field.id} style={s.row} onPress={() => this.props.onChange(field.id)}>
        <Icon name={value === field.id ? 'check-circle' : 'circle'} size={18} color={color.PrimaryText} />
        <Text style={s.optionText}>{field.key ? t(field.key) : field[labelKey]}</Text>
      </TouchableOpacity>
    ));
  }
}

const ds = new DynamicStyleSheet({
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
    color: dynamicColor.PrimaryText,
    paddingVertical: 15,
  } as TextStyle,
  optionText: {
    color: dynamicColor.PrimaryText,
    fontSize: 14,
    marginLeft: 10,
  } as TextStyle,
});
