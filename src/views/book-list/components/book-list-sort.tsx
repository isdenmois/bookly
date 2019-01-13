import * as React from 'react'
import { InjectorContext, inject } from 'react-ioc'
import { observer } from 'mobx-react'
import * as _ from 'lodash'

import { TouchableOpacity, TouchableWithoutFeedback, Modal, StyleSheet, View, ViewStyle, ScrollView, Dimensions, TextStyle } from 'react-native'
import { Body, Button, Radio, Left, List, ListItem, Right, Text, Thumbnail } from 'native-base'

import { Switcher, SwitchOption } from 'components/switcher'
import { TextM } from 'components/text'

import { BookListService } from '../services/book-list.service'

interface Props {
  textStyle: any
}

interface State {
  visible: boolean
  sort: string
  sortDirection: string
}

const SORT_DIRECTION_OPTIONS: SwitchOption[] = [
  {key: 'ASC', title: 'По возрастанию'},
  {key: 'DESC', title: 'По убыванию'},
]

@observer
export class BookListSort extends React.Component<Props, State> {
  static contextType = InjectorContext

  bookListService = inject(this, BookListService)
  state: State = {visible: false, sort: this.bookListService.sort, sortDirection: this.bookListService.sortDirection}
  sortLast: number

  render() {
    const selected: any = _.find(this.bookListService.sortList, {id: this.bookListService.sort} as any) || {name: this.bookListService.sort}

    return (
      <>
        <TouchableOpacity onPress={this.openPicker} style={{flex: 4}}>
          <TextM style={this.props.textStyle}>{selected.name}</TextM>
        </TouchableOpacity>

        {this.state.visible && this.renderModal()}
      </>
    )
  }

  renderModal() {
    return (
      <Modal visible={this.state.visible} onRequestClose={this.closePicker} transparent>
        <View style={s.container}>
          <TouchableWithoutFeedback onPress={this.closePicker}>
            <View style={s.backdrop}/>
          </TouchableWithoutFeedback>
        </View>

        <View style={s.modal}>
          <View style={s.modalView}>
            <View style={s.header}>{this.renderHeader()}</View>
            {this.renderContent()}
            <View style={s.footer}>{this.renderFooter()}</View>
          </View>
        </View>
      </Modal>
    )
  }

  renderHeader() {
    return (
      <Switcher options={SORT_DIRECTION_OPTIONS} value={this.state.sortDirection} onChange={this.setSortDirection}/>
    )
  }

  renderContent() {
    const maxHeight = Dimensions.get('window').height / 2

    this.sortLast = this.bookListService.sortList.length - 1

    return (
      <ScrollView style={[s.list, {maxHeight}]}>
        <List>
          {this.bookListService.sortList.map(this.renderSort)}
        </List>
      </ScrollView>
    )
  }

  renderFooter() {
    return (
      <Button full success onPress={this.save} disabled={!this.state.sort}>
        <TextM style={s.buttonText}>Подтвердить</TextM>
      </Button>
    )
  }

  renderSort = (sort, rowId) => (
    <ListItem key={sort.id} first={!rowId} last={rowId === this.sortLast} onPress={() => this.setSort(sort.id)}>
      <Body>
        <Text>{sort.name}</Text>
      </Body>

      <Right style={s.right}>
        <Radio selected={sort.id === this.state.sort} onPress={() => this.setSort(sort.id)}/>
      </Right>
    </ListItem>
  )

  openPicker = () => this.setState({visible: true})
  closePicker = () => this.setState({visible: false, sort: this.bookListService.sort, sortDirection: this.bookListService.sortDirection})
  setSort = sort => this.setState({sort})
  setSortDirection = sortDirection => this.setState({sortDirection})

  save = () => {
    this.bookListService.setSort(this.state.sort, this.state.sortDirection)
    this.closePicker()
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
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
    top: '5%',
    left: '5%',
    right: '5%',
    bottom: '5%',
    position: 'absolute',
    justifyContent: 'center',
  } as ViewStyle,
  modalView: {
    borderRadius: 5,
    backgroundColor: 'white',
  } as ViewStyle,
  header: {
    padding: 20,
  } as ViewStyle,
  list: {
    flex: 0,
    borderBottomWidth: 0.5,
    borderColor: '#c9c9c9',
  } as ViewStyle,
  right: {
    flex: 0,
  } as ViewStyle,
  footer: {
    padding: 20,
  } as ViewStyle,
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  } as TextStyle,
})
