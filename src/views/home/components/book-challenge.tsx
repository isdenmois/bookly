import * as React from 'react'
import { inject, InjectorContext } from 'react-ioc'
import { observer } from 'mobx-react'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { Card } from 'components/card'

import { TextS, TextL } from 'components/text'

import { HomeService } from 'views/home/home.service'

interface Props {
}

@observer
export class BookChallenge extends React.Component<Props> {
  static contextType = InjectorContext

  homeService = inject(this, HomeService)

  render() {
    return (
      <Card padding>
        <View style={s.container}>
          <View style={s.challengeItem}>
            <TextL style={s.challengeValue}>{this.homeService.booksReadCount}</TextL>
            <TextS style={s.challengeLabel}>Прочтено</TextS>
          </View>
          <View style={s.challengeItem}>
            <TextL style={s.challengeValue}>{this.homeService.booksReadChallenge}</TextL>
            <TextS style={s.challengeLabel}>Запланировано</TextS>
          </View>
          <View style={s.challengeItem}>
            <TextL style={s.challengeValue}>{this.homeService.booksReadForecast}</TextL>
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
