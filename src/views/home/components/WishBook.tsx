import * as React from 'react'
import { Image, ImageStyle, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { Button, Card, CardItem } from 'native-base'

import { TextL, TextM } from 'components/Text'
import { ChangeStatusDialog } from 'views/home/components/ChangeStatusDialog'

interface Props {
  book: any
  onSave: () => void
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
              <Button success full onPress={this.openChangeStatus}>
                <TextM style={s.readButtonText}>Прочитано!</TextM>
              </Button>
            </View>
          </View>
        </CardItem>
        <ChangeStatusDialog book={this.props.book}
                            visible={this.state.changeStatusVisible}
                            onClose={this.closeChangeStatus}
                            onSave={this.props.onSave}/>
      </Card>
    )
  }

  openChangeStatus = () => this.setState({changeStatusVisible: true})

  closeChangeStatus = () => this.setState({changeStatusVisible: false})
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
  } as ViewStyle,
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
  readButtonText: {
    color: 'white',
  } as TextStyle,
})
