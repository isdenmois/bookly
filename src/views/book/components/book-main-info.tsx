import * as React from 'react'

import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'

import { If } from 'components/if'
import { TextM, TextS, TextXs } from 'components/text'
import { Rating } from 'components/rating'

import { BookExtended } from '../book.service'

interface Props {
  book: BookExtended
}

export class BookMainInfo extends React.Component<Props> {
  render() {
    const book = this.props.book,
          addInfo = book.genres.concat(book.year).filter(x => x).join(' | ')

    return (
      <View style={s.container}>
        {If(book.thumbnail) &&
          <View style={s.imageBlock}>
            <AutoHeightImage width={100} source={{uri: book.thumbnail}}/>
          </View>
        }

        <View>
            <TextM>{book.title}</TextM>
            <TextS>{book.authors}</TextS>
            {If(addInfo) &&
              <TextXs>{addInfo}</TextXs>
            }
            {If(book.rating) &&
              <Rating scale={5} value={book.rating}/>
            }
        </View>
      </View>
    )
  }
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  } as ViewStyle,

  imageBlock: {
    marginRight: 10,
  } as ViewStyle,
})
