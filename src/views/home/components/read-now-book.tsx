import * as React from 'react'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Button } from 'native-base'
import AutoHeightImage from 'react-native-auto-height-image'

import { BookS } from 'models/book'
import { color } from 'constants/colors'

import { TextL, TextM } from 'components/text'
import { Card } from 'components/card'

interface Props extends NavigationScreenProps {
  book: BookS
}

export class ReadNowBook extends React.Component<Props> {
  render() {
    const book = this.props.book

    return (
      <Card padding>
        <View style={s.container}>
          {book.thumbnail &&
           <View style={s.imageContainer}>
             <AutoHeightImage width={100} source={{uri: book.thumbnail}}/>
           </View>
          }

          <View style={s.contentContainer}>
            <TextL style={s.title}>{book.title}</TextL>
            <TextM style={s.author}>{book.authorsName}</TextM>
            <Button style={s.readButton} full onPress={this.openChangeStatus}>
              <TextM style={s.readButtonText}>Прочитано</TextM>
            </Button>
          </View>
        </View>
      </Card>
    )
  }

  openChangeStatus = () => this.props.navigation.navigate('ChangeStatus', {book: this.props.book, status: 1})
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
  } as ViewStyle,
  title: {
    color: '#4A4A4A',
    fontWeight: 'bold',
    marginBottom: 10,
  } as TextStyle,
  author: {
    color: '#828281',
    marginBottom: 10,
  } as TextStyle,
  readButton: {
    backgroundColor: color.Green,
  } as ViewStyle,
  readButtonText: {
    color: 'white',
  } as TextStyle,
})
