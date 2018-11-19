import * as React from 'react'
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import cn from 'react-native-classnames'
import { TextS } from 'components/text'
import * as color from 'constants/colors'

export interface SwitchOption {
  key: number | string
  title: string
}

interface Props {
  options: SwitchOption[]
  value: number | string
  onChange: (value: number | string) => void
  style?: any
}

export class Switcher extends React.Component<Props> {
  render() {
    return (
      <View style={[s.container, this.props.style]}>
        {this.props.options.map(option =>
          <TouchableOpacity style={cn(s, ['option', {selected: option.key === this.props.value}])}
                            key={option.key}
                            onPress={() => this.props.onChange(option.key)}
          >
            <TextS style={cn(s, ['text', {selectedText: option.key === this.props.value}])}>
              {option.title}
            </TextS>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: color.green,
    borderWidth: 0.5,
    borderRadius: 2,
  } as ViewStyle,
  option: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: color.green,
    borderRightWidth: 0.5,
    paddingVertical: 10,
  } as ViewStyle,
  selected: {
    backgroundColor: color.green,
  } as ViewStyle,
  text: {
    color: '#444',
  } as TextStyle,
  selectedText: {
    color: 'white',
  } as TextStyle,
})
