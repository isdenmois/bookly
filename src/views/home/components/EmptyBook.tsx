import * as React from 'react'
import { StyleSheet } from 'react-native'
import { Body, Button, Card, CardItem, Text } from 'native-base'

import { TextL } from 'components/Text'
import { marginM } from 'constants/theme'

interface Props {
  onChooseBook: () => void;
}

export class EmptyBook extends React.Component<Props> {
  render() {
    return (
      <Card>
        <CardItem>
          <Body style={s.centered}>
          <TextL>Нет текущей читаемой книги</TextL>

          <Button small bordered block style={s.withMargin} onPress={this.props.onChooseBook}>
            <Text>Добавить</Text>
          </Button>
          </Body>
        </CardItem>
      </Card>
    )
  }
}

const s = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
  },

  withMargin: {
    marginTop: marginM,
  },
})
