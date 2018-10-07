import * as React from 'react'
import { View, Modal, Button, StyleSheet, Text, TouchableWithoutFeedback, ViewStyle } from 'react-native'
import { TextL } from './Text'

interface Props {
  visible: boolean
  onClose: () => void
  header?: string
}

export class Dialog extends React.PureComponent<Props> {
  render() {
    return (
      <Modal visible={this.props.visible} onRequestClose={this.props.onClose} transparent>
        <TouchableWithoutFeedback onPress={this.props.onClose}>
          <View style={s.backdrop}/>
        </TouchableWithoutFeedback>

        <View style={s.modal}>
          <View style={s.modalView}>
            {this.props.header &&
              <View style={s.header}>
                <TextL>{this.props.header}</TextL>
              </View>
            }
            <View style={s.content}>
              {this.props.children}
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

const s = StyleSheet.create({
  backdrop: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
    position: 'absolute',
    backgroundColor: 'black',
  } as ViewStyle,
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  modalView: {
    borderRadius: 5,
    backgroundColor: 'white',
  } as ViewStyle,
  header: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  } as ViewStyle,
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  } as ViewStyle,
})
