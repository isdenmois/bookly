import * as React from 'react'
import { View } from 'react-native'
import { TextM } from 'components/Text'

import s from './styles/book-search-item.css'

interface Props {
  book: any
}

export class BookSearchItem extends React.Component<Props> {
  render() {
    return (
      <View className={s.container}>
        <TextM className={s.author}>{this.props.book.author_name}</TextM>
        <TextM> - </TextM>
        <TextM>{this.props.book.name}</TextM>
      </View>
    )
  }
}
