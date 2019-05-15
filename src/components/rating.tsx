import React from 'react';
import _ from 'lodash';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color } from 'enums/colors';
import { TextM } from 'components/text';

const SIZE = 10;

interface RatingSelectProps {
  value: number;
  size?: number;
  style?: ViewStyle;
  onChange?: (value: number) => void;
}

export class RatingSelect extends React.PureComponent<RatingSelectProps> {
  static defaultProps = { size: SIZE };

  render() {
    const { value, size, style } = this.props;

    return (
      <View style={[s.container, style]}>
        {_.times(size, index => (
          <Icon
            key={index}
            style={s.star}
            name='star'
            size={20}
            solid={index < value}
            onPress={() => this.props.onChange(index + 1)}
          />
        ))}

        <TextM style={s.text}>{value}</TextM>
      </View>
    );
  }
}

interface RatingProps {
  value: number;
  size?: number;
  scale?: number;
  onChange?: (value: number) => void;
}

export class Rating extends React.PureComponent<RatingProps> {
  static defaultProps = { size: SIZE };

  render() {
    const { value, size, scale } = this.props;

    return (
      <View style={s.container}>
        {_.times(scale || size, index => (
          <Icon key={index} style={s.star} solid={index < value} name={this.value(index)} />
        ))}

        <TextM style={s.text}>
          {value} / {size}
        </TextM>
      </View>
    );
  }

  value(index) {
    const max = this.props.scale || this.props.size,
      scale = this.props.size / max,
      value = this.props.value / scale;

    if (index < value && Math.floor(value) === index) {
      return 'star-half-alt';
    }

    return 'star';
  }
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  star: {
    color: color.DeepOrange,
  } as TextStyle,
  text: {
    marginLeft: 10,
  } as TextStyle,
});
