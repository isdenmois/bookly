import * as React from 'react'

import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'

import { BookS } from 'models'

import { Rating } from 'components/rating'
import { TextM, TextS } from 'components/text'
import { DatePicker } from 'native-base';

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
          <View style={s.imageContainer}>
            <AutoHeightImage width={75} source={{uri: book.thumbnail}}/>
          </View>
        }
        <View style={s.infoContainer}>
          <TextM>{book.title}</TextM>
          <TextS style={s.author}>{book.authorsName}</TextS>

          <View style={s.readInfo}>
            <TextM style={s.date}>{book.date.toLocaleDateString()}</TextM>
            <Rating scale={5} value={book.rating}/>
          </View>
        </View>
      </View>
    )
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
