import * as React from 'react'
import { Button, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import { Dialog } from '../../components/Dialog'
import { TextL, TextM } from '../../components/Text'

interface Props {
  book: any
  visible: boolean
  onClose: () => void
}

export class ChangeStatusModal extends React.PureComponent<Props> {
  render() {
    return (
      <Dialog visible={this.props.visible} onClose={this.props.onClose} header='Прочитано'>
        <TextL style={s.title}>{this.props.book.name}</TextL>
        <TextM style={s.author}>{this.props.book.author_name}</TextM>
        <Button
          onPress={this.props.onClose}
          title='Закрыть'
        />
      </Dialog>
    )
  }
}

const s = StyleSheet.create({
  title: {
    color: '#4A4A4A',
    fontWeight: 'bold',
    marginBottom: 10,
  } as TextStyle,
  author: {
    color: '#828281',
    marginBottom: 10,
  } as TextStyle,
})
