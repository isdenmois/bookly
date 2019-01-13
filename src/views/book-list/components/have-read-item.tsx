import * as React from 'react'

import { Linking, StyleSheet, View, ViewStyle, TextStyle, TouchableOpacity } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'

import { BookS } from 'models'

import { Rating } from 'components/rating'
import { TextM, TextS } from 'components/text'

interface Props {
  book: BookS
}

export class HaveReadItem extends React.PureComponent<Props> {
  render() {
    const book = this.props.book,
          hasThumbnail = Boolean(book.thumbnail)

    return (
      <View style={s.container}>
        {hasThumbnail &&
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
            <TextM style={s.date}>{book.date.toLocaleDateString()}</TextM>
            <Rating scale={5} value={book.rating}/>
          </View>
        </View>
      </View>
    )
  }

  openBook = () => {
    Linking.openURL(`http://fantlab.ru/work${this.props.book.id}`)
  }
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
