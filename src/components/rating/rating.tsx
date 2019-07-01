import React from 'react';
import { times } from 'rambdax';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color } from 'types/colors';
import { TextM } from 'components/text';

const SIZE = 10;

interface RatingProps {
  value: number;
  size?: number;
  scale?: number;
  starSize?: number;
  textStyle?: TextStyle;
  onChange?: (value: number) => void;
}

export class Rating extends React.PureComponent<RatingProps> {
  static defaultProps: Partial<RatingProps> = { size: SIZE, starSize: 12 };

  renderStars = times(index => (
    <Icon key={index} size={this.props.starSize} style={s.star} solid={this.isSolid(index)} name={this.value(index)} />
  ));

  render() {
    const { value, size, scale } = this.props;

    return (
      <View style={s.container}>
        {this.renderStars(scale || size)}

        <TextM style={[s.text, this.props.textStyle]}>
          {value} / {size}
        </TextM>
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
