import * as React from 'react'
import * as _ from 'lodash'
import { View } from 'react-native'
import { NavigationConsumer } from 'react-navigation'
import AutoHeightImage from 'react-native-auto-height-image'
import { Button } from 'native-base'
import { TextS, TextM } from 'components/Text'

import s from './styles/book-search-item.css'

interface Props {
  item: any
}

enum BOOK_READ_STATUS {
  WANT_TO_READ = 0,
  HAVE_READ,
  NOW_READING,
}

export class BookSearchItem extends React.Component<Props> {
  render() {
    const book = this.props.item

    return (
      <View className={s.container}>
        {book.pic_100 &&
          <View className={s.imageContainer}>
            <AutoHeightImage width={100}
                             source={{uri: book.pic_100}}
            />
          </View>
        }
        <View className={s.infoContainer}>
          <TextM>{this.props.item.name}</TextM>
          <TextS className={s.author}>{this.props.item.author_name}</TextS>
          {this.renderButton()}
        </View>
      </View>
    )
  }

  renderButton() {
    const status = _.get(this.props.item, 'user_book_partial.book_read')

    if (status === BOOK_READ_STATUS.HAVE_READ) {
      return <TextM>{this.props.item.user_book_partial.rating} / 10</TextM>
    }

    return (
      <NavigationConsumer>
        {navigation => (
          <Button onPress={() => navigation.navigate('ChangeStatus', {book: this.props.item, status: this.nextStatus})}>
            <TextS>{this.bookButtonTitle}</TextS>
          </Button>
        )}
      </NavigationConsumer>
    )
  }

  get bookButtonTitle() {
    const status = _.get(this.props.item, 'user_book_partial.book_read')

    return status === null ? 'Хочу прочитать' : 'В прочитанные'
  }

  get nextStatus() {
    const status = _.get(this.props.item, 'user_book_partial.book_read')

    return status === null ? BOOK_READ_STATUS.WANT_TO_READ : BOOK_READ_STATUS.HAVE_READ
  }
}
