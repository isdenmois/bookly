import * as React from 'react'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Button, Card, CardItem } from 'native-base'
import AutoHeightImage from 'react-native-auto-height-image'

import { Book } from 'models/Book'
import * as color from 'constants/colors'

import { TextL, TextM } from 'components/Text'

interface Props extends NavigationScreenProps {
  book: Book
}

export class ReadNowBook extends React.Component<Props> {
  render() {
    const book = this.props.book

    return (
      <Card>
        <CardItem>
          <View style={s.container}>
            {book.pic100 &&
             <View style={s.imageContainer}>
               <AutoHeightImage width={100} source={{uri: book.pic100}}/>
             </View>
            }

            <View style={s.contentContainer}>
              <TextL style={s.title}>{book.name}</TextL>
              <TextM style={s.author}>{book.authorName}</TextM>
              <Button style={s.readButton} full onPress={this.openChangeStatus}>
                <TextM style={s.readButtonText}>Прочитано</TextM>
              </Button>
            </View>
          </View>
        </CardItem>
      </Card>
    )
  }

  openChangeStatus = () => this.props.navigation.navigate('ChangeStatus', {book: this.props.book, status: 1})
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
  title: {
    color: '#4A4A4A',
    fontWeight: 'bold',
    marginBottom: 10,
  } as TextStyle,
  author: {
    color: '#828281',
    marginBottom: 10,
  } as TextStyle,
  readButton: {
    backgroundColor: color.green,
  } as ViewStyle,
  readButtonText: {
    color: 'white',
  } as TextStyle,
})
