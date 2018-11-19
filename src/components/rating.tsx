import * as React from 'react'
import * as _ from 'lodash'
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { Icon } from 'native-base'
import { color } from 'constants/colors'
import { TextM } from './text'

interface Props {
  value: number
  style?: any
  scale?: number
  size?: number
}

interface SelectProps extends Props {
  onChange: (rating: number) => void
}

const SIZE = 10

export class RatingSelect extends React.PureComponent<SelectProps> {
  static defaultProps: Partial<SelectProps> = {size: SIZE}

  render() {
    const { value, size, style } = this.props

    return (
      <View style={[s.container, style]}>
        {_.times(size, index =>
          <Icon key={index}
                style={s.star}
                name={index < value ? 'md-star' : 'md-star-outline'}
                onPress={() => this.props.onChange(index + 1)}
          />
        )}

        <TextM style={s.text}>{value} / {size}</TextM>
      </View>
    )
  }
}

export class Rating extends React.PureComponent<Props> {
  static defaultProps: Partial<SelectProps> = {size: SIZE}

  render() {
    const { value, size, scale } = this.props

    return (
      <View style={s.container}>
        {_.times(scale || size, index =>
          <Icon key={index}
                style={s.star}
                name={this.value(index)}
          />
        )}

        <TextM style={s.text}>{value} / {size}</TextM>
      </View>
    )
  }

  value(index) {
    const max = this.props.scale || this.props.size,
          scale = this.props.size / max,
          value = this.props.value / scale

    if (index < value && Math.floor(value) === index) {
      return 'md-star-half'
    }

    return index < value ? 'md-star' : 'md-star-outline'
  }
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  star: {
    color: color.DeepOrange,
  },
  text: {
    marginLeft: 10,
  } as TextStyle,
})
