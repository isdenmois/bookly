import * as React from 'react'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { TextM } from 'components/Text'

interface Props {
}

export class EmptyResult extends React.Component<Props> {
  render() {
    return (
      <View style={s.container}>
        <TextM style={s.notFoundText}>Поиск не дал результатов</TextM>
      </View>
    )
  }
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 40,
  } as ViewStyle,
  notFoundText: {
    color: '#999',
  } as TextStyle,
})
