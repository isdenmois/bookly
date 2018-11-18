import * as React from 'react'
import { TextM } from './Text'

interface Props {
  count: number
}

export class FoundResults extends React.Component<Props> {
  render() {
    return (
      <TextM>
        Найдено: {this.props.count}
      </TextM>
    )
  }
}
