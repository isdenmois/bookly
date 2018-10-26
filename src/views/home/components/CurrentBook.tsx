import * as _ from 'lodash'
import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { inject, observer } from 'mobx-react'

import { notImplemented } from 'constants/not-implemented-yet'

import { HomeStore } from '../services/HomeStore'
import { EmptyBook } from './EmptyBook'
import { WishBook } from './WishBook'

interface Props extends NavigationScreenProps {
  homeStore?: HomeStore;
}

@inject('homeStore')
@observer
export class CurrentBook extends React.Component<Props> {
  render() {
    const books = this.props.homeStore.currentBooks

    if (_.isEmpty(books)) {
      return <EmptyBook onChooseBook={notImplemented}/>
    }

    return <WishBook book={books[0]}/>
  }
}
