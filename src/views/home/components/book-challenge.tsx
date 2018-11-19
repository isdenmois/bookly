import * as React from 'react'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { Card } from 'components/card'

import { TextS, TextL } from 'components/text'

import { UserChallenge } from 'models/user-challenge'

interface Props {
  challenge: UserChallenge
}

export class BookChallenge extends React.Component<Props> {
  render() {
    const { countBooksRead, countBooksTotal, countBooksForecast} = this.props.challenge

    return (
      <Card padding>
        <View style={s.container}>
          <View style={s.challengeItem}>
            <TextL style={s.challengeValue}>{countBooksRead}</TextL>
            <TextS style={s.challengeLabel}>Прочтено</TextS>
          </View>
          <View style={s.challengeItem}>
            <TextL style={s.challengeValue}>{countBooksTotal}</TextL>
            <TextS style={s.challengeLabel}>Запланировано</TextS>
          </View>
          <View style={s.challengeItem}>
            <TextL style={s.challengeValue}>{countBooksForecast}</TextL>
            <TextS style={s.challengeLabel}>Опережение</TextS>
          </View>
        </View>
      </Card>
    )
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  } as ViewStyle,
  challengeItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  } as ViewStyle,
  challengeValue: {
    fontWeight: 'bold',
  } as TextStyle,
  challengeLabel: {
    color: '#424242',
  } as TextStyle,
})
