import * as React from 'react'
import * as _ from 'lodash'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { inject, InjectorContext } from 'react-ioc'
import AutoHeightImage from 'react-native-auto-height-image'
import { Button, Icon } from 'native-base'
const { NavigationConsumer } = require('react-navigation')
import { observer } from 'mobx-react'

import { Books } from 'services'
import { FantlabWork } from 'api/fantlab'
import { BOOK_READ_STATUS, BookS } from 'models/book'
import { color } from 'constants/colors'

import { Rating } from 'components/rating'
import { TextS, TextM } from 'components/text'

interface Props {
  item: FantlabWork
}

interface State {
  book: BookS
}

@observer
export class BookSearchItem extends React.Component<Props, State> {
  static contextType = InjectorContext

  bookService = inject(this, Books)

  state = {
    book: this.bookService.find(this.props.item.work_id),
  }

  render() {
    const item = this.props.item

    return (
      <View style={s.container}>
        {Boolean(item.thumbnail) &&
          <View style={s.imageContainer}>
            <AutoHeightImage width={75}
                             source={{uri: item.thumbnail}}
            />
          </View>
        }
        <View style={s.infoContainer}>
          <TextM>{item.rusname}</TextM>
          <TextS style={s.author}>{item.autor_rusname}</TextS>
          {this.renderButton()}
        </View>
      </View>
    )
  }

  renderButton() {
    const status = _.get(this.state.book, 'status')

    if (status === BOOK_READ_STATUS.HAVE_READ) {
      return <Rating scale={5} value={this.state.book.rating}/>
    }

    return (
      <NavigationConsumer>
        {navigation => (
          <Button iconLeft style={s.button} onPress={() => this.openChangeStatus(navigation)}>
            <Icon name='book'/>
            <TextM style={s.buttonText}>{this.bookButtonTitle}</TextM>
          </Button>
        )}
      </NavigationConsumer>
    )
  }

  openChangeStatus(navigation) {
    const params = {
      book: this.state.book,
      status: this.nextStatus,
    }

    if (!this.state.book) {
      params.book = this.bookService.createFromWork(this.props.item)

      this.setState({book: params.book})
    }

    navigation.navigate('ChangeStatus', params)
  }

  get bookButtonTitle() {
    const status = _.get(this.state.book, 'status') || BOOK_READ_STATUS.NONE

    return status === BOOK_READ_STATUS.NONE ? 'Хочу прочитать' : 'В прочитанные'
  }

  get nextStatus() {
    const status = _.get(this.state.book, 'status') || BOOK_READ_STATUS.NONE

    return status === BOOK_READ_STATUS.NONE ? BOOK_READ_STATUS.WANT_TO_READ : BOOK_READ_STATUS.HAVE_READ
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
