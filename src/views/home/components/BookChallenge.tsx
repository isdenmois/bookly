import * as React from 'react'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { Body, Card, CardItem } from 'native-base'

import { TextS, TextL } from 'components/Text'

import { UserChallenge } from '../services/HomeStore'

interface Props {
  challenge: UserChallenge
}

export class BookChallenge extends React.Component<Props> {
  render() {
    const { booksCountRead, booksCountTotal, booksCountForecast } = this.props.challenge;

    return (
      <Card>
        <CardItem>
          <Body>
            <View style={s.container}>
              <View style={s.challengeItem}>
                <TextL style={s.challengeValue}>{booksCountRead}</TextL>
                <TextS style={s.challengeLabel}>Прочтено</TextS>
              </View>
              <View style={s.challengeItem}>
                <TextL style={s.challengeValue}>{booksCountTotal}</TextL>
                <TextS style={s.challengeLabel}>Запланировано</TextS>
              </View>
              <View style={s.challengeItem}>
                <TextL style={s.challengeValue}>{booksCountForecast}</TextL>
                <TextS style={s.challengeLabel}>Опережение</TextS>
              </View>
            </View>
          </Body>
        </CardItem>
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
