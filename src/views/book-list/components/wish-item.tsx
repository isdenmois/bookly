import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'

import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'
import { Button, Icon } from 'native-base'

import { BookS } from 'models'
import { color } from 'constants/colors'
import { TextM, TextS } from 'components/text'
import { BOOK_READ_STATUS } from 'models/book'

interface Props extends NavigationScreenProps {
  book: BookS
}

export class WishItem extends React.Component<Props> {
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
