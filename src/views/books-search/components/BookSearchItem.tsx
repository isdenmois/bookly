import * as React from 'react'
import { View } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'
import { Button } from 'native-base'
import { TextS, TextM } from 'components/Text'

import s from './styles/book-search-item.css'

interface Props {
  item: any
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
    // TODO: отдельная кнопка в зависимости от типа

    return (
      <Button>
        <TextS>Хочу прочитать</TextS>
      </Button>
    )
  }
}
