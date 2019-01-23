import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'

import format from 'date-fns/format'

import { Linking, StyleSheet, View, ViewStyle, TextStyle, TouchableOpacity } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'

import { feature } from 'utils/feature'
import { BookS } from 'models'

import { If } from 'components/if'
import { Rating } from 'components/rating'
import { TextM, TextS } from 'components/text'

interface Props extends NavigationScreenProps {
  book: BookS
}

export class HaveReadItem extends React.PureComponent<Props> {
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

          <View style={s.readInfo}>
            <TextM style={s.date}>{this.renderDate()}</TextM>
            <Rating scale={5} value={book.rating}/>
          </View>
        </View>
      </View>
    )
  }

  renderDate() {
    return format(this.props.book.date, 'YYYY.MM.DD')
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

  readInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  infoContainer: {
    flexDirection: 'column',
    flex: 1,
  } as ViewStyle,

  author: {
    color: '#424242',
  } as TextStyle,

  date: {
    color: '#424242',
    marginRight: 10,
  } as TextStyle,
})
