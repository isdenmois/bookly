import React from 'react';
import _ from 'lodash';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color } from 'types/colors';
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
  withoutValue?: boolean;
  starSize?: number;
  onChange?: (value: number) => void;
}

export class Rating extends React.PureComponent<RatingProps> {
  static defaultProps: Partial<RatingProps> = { size: SIZE, starSize: 12 };

  render() {
    const { value, size, scale, starSize, withoutValue } = this.props;

    return (
      <View style={s.container}>
        {_.times(scale || size, index => (
          <Icon key={index} size={starSize} style={s.star} solid={this.isSolid(index)} name={this.value(index)} />
        ))}

        {!withoutValue && (
          <TextM style={s.text}>
            {value} / {size}
          </TextM>
        )}
      </View>
    );
  }

  isSolid(index) {
    const max = this.props.scale || this.props.size;

    return (index * this.props.size) / max < this.props.value;
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