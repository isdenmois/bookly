import * as React from 'react'
import { StyleSheet } from 'react-native'
import { Button, Text } from 'native-base'

import { Card } from 'components/card'
import { marginM } from 'constants/theme'

interface Props {
  onChooseBook: () => void
  chooseBookAvailable: boolean
}

export class EmptyBook extends React.Component<Props> {
  render() {
    return (
      <Card padding margin title='Нет текущей читаемой книги'>
        {this.props.chooseBookAvailable &&
          <Button small bordered block style={s.withMargin} onPress={this.props.onChooseBook}>
            <Text>Выбрать</Text>
          </Button>
        }
      </Card>
    )
  }
}

const s = StyleSheet.create({
  withMargin: {
    marginTop: marginM,
  },
})
