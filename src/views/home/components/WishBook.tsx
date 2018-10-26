import * as React from 'react'
import * as _ from 'lodash'
import { Image, ImageStyle, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { Button, Card, CardItem } from 'native-base'

import * as query from 'modules/api/query'
import { TextL, TextM } from 'components/Text'
import { ChangeStatusModal } from 'views/change-status/ChangeStatusModal'

import { BookStatusMutation } from '../mutations/BookStatusMutation'

interface Props {
  book: any;
}

interface State {
  changeStatusVisible: boolean
}

export class WishBook extends React.Component<Props, State> {
  state = {
    changeStatusVisible: false,
  }

  render() {
    const book = this.props.book

    return (
      <Card>
        <CardItem>
          <View style={s.container}>
            {book.pic_100 &&
             <View style={s.imageContainer}>
               <Image style={s.image}
                      source={{uri: book.pic_100}}>
               </Image>
             </View>
            }

            <View style={s.contentContainer}>
              <TextL style={s.title}>{book.name}</TextL>
              <TextM style={s.author}>{book.author_name}</TextM>
              <View style={s.buttonContainer}>
                <Button success style={s.readButton} onPress={this.openChangeStatus}>
                  <TextM>Прочитано</TextM>
                </Button>
              </View>
            </View>
          </View>
        </CardItem>
        <ChangeStatusModal book={this.props.book}
                           visible={this.state.changeStatusVisible}
                           onClose={this.closeChangeStatus}
                           onSave={this.changeStatus}/>
      </Card>
    )
  }

  openChangeStatus = () => this.setState({changeStatusVisible: true})

  closeChangeStatus = () => this.setState({changeStatusVisible: false})

  changeStatus = (params) => {
    const { book } = this.props,
          mutation = new BookStatusMutation(book, params)

    this.closeChangeStatus()
    query.update(mutation)
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
  },
  image: {
    width: 100,
    flex: 1,
    alignSelf: 'stretch',
  } as ImageStyle,
  title: {
    color: '#4A4A4A',
    fontWeight: 'bold',
    marginBottom: 10,
  } as TextStyle,
  author: {
    color: '#828281',
    marginBottom: 10,
  } as TextStyle,
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  } as ViewStyle,
  readButton: {
    paddingHorizontal: 20,
  },
})
