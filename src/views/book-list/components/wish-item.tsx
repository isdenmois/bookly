import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'

import { Linking, StyleSheet, View, ViewStyle, TextStyle, TouchableOpacity } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'
import { Button, Icon } from 'native-base'

import { If } from 'components/if'
import { feature } from 'utils/feature'
import { BookS } from 'models'
import { color } from 'constants/colors'
import { TextM, TextS } from 'components/text'
import { BOOK_READ_STATUS } from 'models/book'

interface Props extends NavigationScreenProps {
  book: BookS
}

export class WishItem extends React.PureComponent<Props> {
  render() {
    const book = this.props.book

    return (
      <View style={s.container}>
        {If(book.thumbnail) &&
          <TouchableOpacity style={s.imageContainer} onPress={this.openBook}>
            <AutoHeightImage width={75} source={{uri: book.thumbnail}}/>
          </TouchableOpacity>
        }
        <View style={s.infoContainer}>
          <TouchableOpacity onPress={this.openBook}>
            <TextM>{book.title}</TextM>
          </TouchableOpacity>
          <TextS style={s.author}>{book.authorsName}</TextS>

          <Button iconLeft style={s.button} onPress={this.openChangeStatus}>
            <Icon name='book'/>
            <TextM style={s.buttonText}>Читать</TextM>
          </Button>
        </View>
      </View>
    )
  }

  openChangeStatus = () => {
    const params = {
      book: this.props.book,
      status: BOOK_READ_STATUS.NOW_READING,
    }

    this.props.navigation.navigate('ChangeStatus', params)
  }

  openBookScreen = () => {
    this.props.navigation.push('Book', {workId: this.props.book.id})
  }

  openBookURL = () => {
    Linking.openURL(`http://fantlab.ru/work${this.props.book.id}`)
  }

  openBook = feature('2.4.0', this.openBookScreen, this.openBookURL)
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
  } as ViewStyle,

  imageContainer: {
    marginRight: 10,
  } as ViewStyle,

  infoContainer: {
    flexDirection: 'column',
    flex: 1,
  } as ViewStyle,

  author: {
    color: '#424242',
  } as TextStyle,

  button: {
    backgroundColor: color.Green,
    marginTop: 10,
  } as ViewStyle,

  buttonText: {
    padding: 10,
    color: 'white',
  } as TextStyle,
})
