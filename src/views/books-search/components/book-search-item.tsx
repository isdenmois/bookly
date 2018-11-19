import * as React from 'react'
import * as _ from 'lodash'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'
import { Button, Icon } from 'native-base'
const { NavigationConsumer } = require('react-navigation')

import { Book, BOOK_READ_STATUS } from 'models/book'
import { color } from 'constants/colors'

import { Rating } from 'components/rating'
import { TextS, TextM } from 'components/text'

interface Props {
  item: Book
}

export class BookSearchItem extends React.Component<Props> {
  render() {
    const book = this.props.item

    return (
      <View style={s.container}>
        {book.pic100 &&
          <View style={s.imageContainer}>
            <AutoHeightImage width={100}
                             source={{uri: book.pic100}}
            />
          </View>
        }
        <View style={s.infoContainer}>
          <TextM>{this.props.item.name}</TextM>
          <TextS style={s.author}>{this.props.item.authorName}</TextS>
          {this.renderButton()}
        </View>
      </View>
    )
  }

  renderButton() {
    const status = _.get(this.props.item, 'userBookPartial.bookRead')

    if (status === BOOK_READ_STATUS.HAVE_READ) {
      return <Rating scale={5} value={this.props.item.userBookPartial.rating}/>
    }

    return (
      <NavigationConsumer>
        {navigation => (
          <Button iconLeft style={s.button}
                  onPress={() => navigation.navigate('ChangeStatus', {book: this.props.item, status: this.nextStatus})}>
            <Icon name='book'/>
            <TextM style={s.buttonText}>{this.bookButtonTitle}</TextM>
          </Button>
        )}
      </NavigationConsumer>
    )
  }

  get bookButtonTitle() {
    const status = _.get(this.props.item, 'userBookPartial.bookRead', null)

    return status === null ? 'Хочу прочитать' : 'В прочитанные'
  }

  get nextStatus() {
    const status = _.get(this.props.item, 'userBookPartial.bookRead', null)

    return status === null ? BOOK_READ_STATUS.WANT_TO_READ : BOOK_READ_STATUS.HAVE_READ
  }
}

const s = StyleSheet.create({
  author: {
    color: '#424242',
  } as TextStyle,

  container: {
    display: 'flex',
    flexDirection: 'row',
  } as ViewStyle,

  imageContainer: {
    marginRight: 10,
  } as ViewStyle,

  infoContainer: {
    flexDirection: 'column',
    flex: 1,
  } as ViewStyle,

  button: {
    backgroundColor: color.Green,
    marginTop: 10,
  },

  buttonText: {
    padding: 10,
    color: 'white',
  } as TextStyle,
})
