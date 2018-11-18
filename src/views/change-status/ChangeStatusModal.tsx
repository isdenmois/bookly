import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { DialogModal as Dialog } from 'components/Dialog'
import AutoHeightImage from 'react-native-auto-height-image'
import { Button, DatePicker } from 'native-base'
import { Rating } from 'components/Rating'
import { TextL, TextM } from 'components/Text'
import { Switcher, SwitchOption } from 'components/Switcher'

import { MARK_AS_READ_MUTATION, CHANGE_STATUS_MUTATION } from './mutations'

import { client } from '../../services/apollo-client-bridge'

interface Props extends NavigationScreenProps {
}

interface State {
  date: Date
  rating: number
  status: BOOK_READ_STATUS
}

enum BOOK_READ_STATUS {
  WANT_TO_READ = 0,
  HAVE_READ,
  NOW_READING,
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

const mutations = {
  [BOOK_READ_STATUS.WANT_TO_READ]: CHANGE_STATUS_MUTATION,
  [BOOK_READ_STATUS.HAVE_READ]: MARK_AS_READ_MUTATION,
  [BOOK_READ_STATUS.NOW_READING]: CHANGE_STATUS_MUTATION,
}

export class ChangeStatusModal extends React.Component<Props, State> {
  state = {
    date: new Date(),
    rating: 0,
    status: this.props.navigation.getParam('status', 0),
  }

  render() {
    const status = this.state.status,
          book   = this.props.navigation.getParam('book', {})

    return (
      <Dialog navigation={this.props.navigation} header={statusMap[status]}>
        <View style={s.content}>
          <View style={s.info}>
            {book.pic_100 &&
             <View style={s.imageContainer}>
               <AutoHeightImage width={100} source={{uri: book.pic_100}}/>
             </View>
            }

            <View style={s.contentContainer}>
              <TextL style={s.title}>{book.name}</TextL>
              <TextM style={s.author}>{book.author_name}</TextM>

              {status === BOOK_READ_STATUS.HAVE_READ &&
                <DatePicker defaultDate={this.state.date} locale='ru' onDateChange={this.selectDate}/>
              }
            </View>
          </View>

          <Switcher options={statusOptions} value={this.state.status} onChange={this.setStatus}/>

          {status === BOOK_READ_STATUS.HAVE_READ &&
            <Rating value={this.state.rating} onChange={this.setRating}/>
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

  get disabled() {
    if (this.state.status === BOOK_READ_STATUS.HAVE_READ) {
      return !this.state.rating
    }

    return false
  }

  selectDate = date => this.setState({date})
  setStatus = status => this.setState({status})
  setRating = rating => this.setState({rating})

  save = () => {
    const { date, rating, status } = this.state,
          book = this.props.navigation.getParam('book', {}),
          mutation = mutations[status],
          variables = {
            bookId: book.id,
            date_day: date.getDate(),
            date_month: date.getMonth() + 1,
            date_year: date.getFullYear(),
            status,
            rating,
          }

    client.mutate({mutation, variables, refetchQueries: ['userChallenge']})
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

  button: {
    padding: 20,
  } as ViewStyle,

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  } as TextStyle,
})
