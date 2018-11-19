import * as React from 'react'
import * as _ from 'lodash'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { Icon } from 'native-base'
import { TextM } from './text'

interface Props {
  value: number
  onChange: (rating: number) => void
}

const SIZE = 10

export class Rating extends React.PureComponent<Props> {
  render() {
    const { value } = this.props

    return (
      <View style={s.container}>
        {_.times(SIZE, index =>
          <Icon key={index}
                style={s.star}
                name={index < value ? 'md-star' : 'md-star-outline'}
                onPress={() => this.props.onChange(index + 1)}
          />
        )}
        <TextM>{value} / {SIZE}</TextM>
      </View>
    )
  }
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  star: {
    color: '#FF5722',
  },
})
