import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { Dialog } from 'components/dialog'
import AutoHeightImage from 'react-native-auto-height-image'
import { Button, DatePicker } from 'native-base'

import { BOOK_READ_STATUS, BookS } from 'models/book'

import { RatingSelect } from 'components/rating'
import { TextL, TextM } from 'components/text'
import { Switcher, SwitchOption } from 'components/switcher'

interface Props extends NavigationScreenProps {
}

interface State {
  date: Date
  rating: number
  status: BOOK_READ_STATUS
}

const statusOptions: SwitchOption[] = [
  {key: BOOK_READ_STATUS.NOW_READING, title: 'Читаю сейчас'},
  {key: BOOK_READ_STATUS.WANT_TO_READ, title: 'Хочу прочитать'},
  {key: BOOK_READ_STATUS.HAVE_READ, title: 'Прочитано'},
]

const statusMap = {
  [BOOK_READ_STATUS.WANT_TO_READ]: 'Хочу прочитать',
  [BOOK_READ_STATUS.HAVE_READ]: 'Прочитано',
  [BOOK_READ_STATUS.NOW_READING]: 'Сейчас читаю',
}

export class ChangeStatusModal extends React.Component<Props, State> {
  book: BookS = this.props.navigation.getParam('book', {})
  state = {
    date: new Date(),
    rating: 0,
    status: this.props.navigation.getParam('status', 0),
  }

  render() {
    const status = this.state.status

    return (
      <Dialog navigation={this.props.navigation} header={statusMap[status]}>
        <View style={s.content}>
          <View style={s.info}>
            {this.book.thumbnail &&
             <View style={s.imageContainer}>
               <AutoHeightImage width={100} source={{uri: this.book.thumbnail}}/>
             </View>
            }

            <View style={s.contentContainer}>
              <TextL style={s.title}>{this.book.title}</TextL>
              <TextM style={s.author}>{this.book.authorsName}</TextM>

              {status === BOOK_READ_STATUS.HAVE_READ &&
                <DatePicker defaultDate={this.state.date} locale='ru' onDateChange={this.selectDate}/>
              }
            </View>
          </View>

          <Switcher options={statusOptions} value={this.state.status} onChange={this.setStatus}/>

          {status === BOOK_READ_STATUS.HAVE_READ &&
            <RatingSelect style={s.rating} value={this.state.rating} onChange={this.setRating}/>
          }
        </View>

        <View style={s.button}>
          <Button full success onPress={this.save} disabled={this.disabled}>
            <TextM style={s.buttonText}>Сохранить</TextM>
          </Button>
        </View>
      </Dialog>
    )
  }

  get disabled(): boolean {
    if (this.state.status === BOOK_READ_STATUS.HAVE_READ) {
      return !this.state.rating
    }

    return false
  }

  selectDate = date => this.setState({date})
  setStatus = status => this.setState({status})
  setRating = rating => this.setState({rating})

  save = () => {
    const { date, rating, status } = this.state

    this.book.changeStatus(status, rating, date)
    this.props.navigation.goBack()
  }
}

const s = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
  } as ViewStyle,

  info: {
    flexDirection: 'row',
    paddingVertical: 20,
  } as ViewStyle,

  imageContainer: {
    marginRight: 10,
  } as ViewStyle,

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

  rating: {
    marginTop: 10,
  } as ViewStyle,

  button: {
    padding: 20,
  } as ViewStyle,

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  } as TextStyle,
})
