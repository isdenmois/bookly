import * as React from 'react'
import gql from 'graphql-tag'
import { Image, ImageStyle, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { Button, DatePicker } from 'native-base'

import { client } from 'services/apollo-client-bridge'

import { Dialog } from 'components/Dialog'
import { TextL, TextM } from 'components/Text'
import { Rating } from 'components/Rating'

interface Props {
  book: any
  visible: boolean
  onClose: () => void
  onSave: () => void
}

interface State {
  date: Date
  rating: number
}

const mutation = gql`
  mutation markAsRead($bookId: ID!, $date_day: Int!, $date_month: Int!, $date_year: Int!, $rating: Int!) {
    changeStatus(bookId: $bookId, book_read: 1, date_day: $date_day, date_month: $date_month, date_year: $date_year, rating: $rating) {
      id
      user_book_partial {
        book_read
        date_day
        date_month
        date_year
        rating
      }
    }
  }
`

export class ChangeStatusDialog extends React.PureComponent<Props, State> {
  state = {
    date: new Date(),
    rating: 0,
  }

  render() {
    const { book, onClose, visible } = this.props

    return (
      <Dialog visible={visible} onClose={onClose} header='Прочитано'>
        <View style={s.content}>
          <View style={s.info}>
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

              <DatePicker defaultDate={this.state.date}
                          locale='ru'
                          onDateChange={this.selectDate}/>
            </View>
          </View>

          <Rating value={this.state.rating}
                  onChange={this.setRating}/>
        </View>

        <View style={s.button}>
          <Button full success onPress={this.save} disabled={!this.state.rating}>
            <TextM style={s.buttonText}>Сохранить</TextM>
          </Button>
        </View>
      </Dialog>
    )
  }

  selectDate = date => this.setState({date})
  setRating = rating => this.setState({rating})

  save = () => {
    const { date, rating } = this.state,
          { book } = this.props,
          variables = {
            bookId: book.id,
            date_day: date.getDate(),
            date_month: date.getMonth() + 1,
            date_year: date.getFullYear(),
            rating,
          }

    this.props.onClose()
    this.props.onSave()
    client.mutate({mutation, variables, refetchQueries: ['userChallenge']})
    this.resetState()
  }

  resetState = () => this.setState({
    date: new Date(),
    rating: 0,
  })
}

const s = StyleSheet.create({
  info: {
    flexDirection: 'row',
    paddingVertical: 20,
  } as ViewStyle,
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
  image: {
    width: 100,
    flex: 1,
    alignSelf: 'stretch',
  } as ImageStyle,
  content: {
    paddingHorizontal: 20,
  } as ViewStyle,
  button: {
    padding: 20,
  } as ViewStyle,
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  } as TextStyle,
  footer: {
    flexDirection: 'row',
  } as ViewStyle,
})
