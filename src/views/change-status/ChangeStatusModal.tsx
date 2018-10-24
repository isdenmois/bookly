import * as React from 'react'
import { Image, ImageStyle, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import { Button, DatePicker, Item, Label } from 'native-base'
import { Dialog } from '../../components/Dialog'
import { TextL, TextM } from '../../components/Text'
import { Rating } from '../../components/Rating'

interface Props {
  book: any
  visible: boolean
  onClose: () => void
  onSave: (params) => void
}

interface State {
  date: Date
  rating: number
}

export class ChangeStatusModal extends React.PureComponent<Props, State> {
  state = {
    date: new Date(),
    rating: 0,
  }

  render() {
    const { book, onClose, visible } = this.props

    return (
      <Dialog visible={visible} onClose={onClose} header='Прочитано'>
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

        <Button style={s.button} success onPress={this.save} disabled={!this.state.rating}>
          <TextM style={s.buttonText}>Сохранить</TextM>
        </Button>
      </Dialog>
    )
  }

  selectDate = date => this.setState({date})
  setRating = rating => this.setState({rating})

  save = () => {
    const { date, rating } = this.state,
          params = {
            book_read: 1,
            date_day: date.getDate(),
            date_month: date.getMonth() + 1,
            date_year: date.getFullYear(),
            fields: 'id',
            rating,
          }

    this.props.onSave(params)
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
  button: {
    width: '100%',
    justifyContent: 'center',
  } as ViewStyle,
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  } as TextStyle,
  footer: {
    flexDirection: 'row',
  } as ViewStyle,
})
