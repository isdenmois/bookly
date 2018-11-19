import * as React from 'react'
import * as _ from 'lodash'
import { TextInputProps } from 'react-native'
import { Input } from 'native-base'

interface Props extends TextInputProps {
  next?: Field
}

export class Field extends React.PureComponent<Props> {
  private ref: any

  render() {
    const inputProps: TextInputProps = _.omit(this.props, ['next']),
          formProps: TextInputProps = {}

    if (this.props.next) {
      formProps.blurOnSubmit = false
      formProps.onSubmitEditing = this.goToNextField
    }

    return (
      <Input ref={this.saveRef} {...inputProps} {...formProps}/>
    )
  }

  focus() {
    this.ref._root.focus()
  }

  private saveRef = input => this.ref = input

  private goToNextField = () => this.props.next.focus()
}
