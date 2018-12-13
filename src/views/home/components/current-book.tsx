import * as React from 'react'
import { View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { inject, InjectorContext } from 'react-ioc'
import { observer } from 'mobx-react'

import { Books } from 'services'

import { EmptyBook } from './empty-book'
import { ReadNowBook } from './read-now-book'

interface Props extends NavigationScreenProps {
}

@observer
export class CurrentBook extends React.Component<Props> {
  static contextType = InjectorContext

  books = inject(this, Books)

  render() {
    const { currentBooks, wantToRead } = this.books

    return (
      <View>
        {currentBooks.length > 0 &&
          <ReadNowBook book={currentBooks[0]} navigation={this.props.navigation}/>
        }

        {currentBooks.length === 0 &&
          <EmptyBook onChooseBook={this.openBookSelectDialog} chooseBookAvailable={wantToRead.length > 0}/>
        }
      </View>
    )
  }

  openBookSelectDialog = () => this.props.navigation.navigate('BookSelect', {books: this.books.wantToRead})
}
