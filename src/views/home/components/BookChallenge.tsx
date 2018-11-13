import * as React from 'react'
import { View } from 'react-native'
import { Body, Card, CardItem } from 'native-base'
import s from './styles/book-challenge.css'

import { TextS, TextL } from 'components/Text'

import { UserChallenge } from '../HomeModels'

interface Props {
  challenge: UserChallenge
}

export class BookChallenge extends React.Component<Props> {
  render() {
    const { count_books_read, count_books_total, count_books_forecast} = this.props.challenge

    return (
      <Card>
        <CardItem>
          <Body>
            <View className={s.container}>
              <View className={s.challengeItem}>
                <TextL className={s.challengeValue}>{count_books_read}</TextL>
                <TextS className={s.challengeLabel}>Прочтено</TextS>
              </View>
              <View className={s.challengeItem}>
                <TextL className={s.challengeValue}>{count_books_total}</TextL>
                <TextS className={s.challengeLabel}>Запланировано</TextS>
              </View>
              <View className={s.challengeItem}>
                <TextL className={s.challengeValue}>{count_books_forecast}</TextL>
                <TextS className={s.challengeLabel}>Опережение</TextS>
              </View>
            </View>
          </Body>
        </CardItem>
      </Card>
    )
  }
}
