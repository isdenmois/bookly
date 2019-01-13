import * as React from 'react'
import * as _ from 'lodash'

import { Text, TouchableOpacity } from 'react-native'
import ModalFilterPicker from 'react-native-modal-filter-picker'

interface Props {
  data: any[]
  placeholder: string
  selected: number | string
  onSelect: (id: number | string) => void
  textStyle: any
}

interface State {
  visible: boolean
}

export class BookListOptionSelect extends React.Component<Props, State> {
  state: State = {visible: false}

  render() {
    const selected: any = this.props.selected && _.find(this.props.data, {id: this.props.selected} as any)

    return (
      <>
        <TouchableOpacity onPress={this.openPicker} style={{flex: 4}}>
          {!!selected && <Text style={this.props.textStyle}>{selected.name}</Text>}
          {!selected && <Text style={[this.props.textStyle, {color: '#ccc'}]}>{this.props.placeholder}</Text>}
        </TouchableOpacity>

        <ModalFilterPicker
          visible={this.state.visible}
          onSelect={this.selectItem}
          onCancel={this.closePicker}
          noResultsText='Ничего не найдено'
          placeholderText={this.props.placeholder}
          selectedOption={this.props.selected && this.props.selected.toString() || '0'}
          keyboardShouldPersistTaps='handle'
          options={this.options}
        />
      </>
    )
  }

  get options() {
    const rows = this.props.data.map(item => ({key: item.id.toString(), label: item.name}))

    return [{key: '0', label: 'Сбросить'}].concat(rows)
  }

  openPicker = () => this.setState({visible: true})
  closePicker = () => this.setState({visible: false})
  selectItem = id => {
    this.props.onSelect(_.isNaN(+id) ? id : +id)
    this.closePicker()
  }
}
