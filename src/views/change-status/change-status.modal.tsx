import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { DialogModal as Dialog } from 'components/dialog'
import AutoHeightImage from 'react-native-auto-height-image'
import { Button, DatePicker } from 'native-base'

import { Book, BOOK_READ_STATUS } from 'models/book'
import { client } from 'services/client'

import { Rating } from 'components/rating'
import { TextL, TextM } from 'components/text'
import { Switcher, SwitchOption } from 'components/switcher'

import { MARK_AS_READ_MUTATION, CHANGE_STATUS_MUTATION } from './mutations'

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
    const status     = this.state.status,
          book: Book = this.props.navigation.getParam('book', {})

    return (
      <Dialog navigation={this.props.navigation} header={statusMap[status]}>
        <View style={s.content}>
          <View style={s.info}>
            {book.pic100 &&
             <View style={s.imageContainer}>
               <AutoHeightImage width={100} source={{uri: book.pic100}}/>
             </View>
            }

            <View style={s.contentContainer}>
              <TextL style={s.title}>{book.name}</TextL>
              <TextM style={s.author}>{book.authorName}</TextM>

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
    const { date, rating, status } = this.state,
          book: Book = this.props.navigation.getParam('book', {}),
          mutation = mutations[status],
          variables = {
            bookId: book.id,
            dateDay: date.getDate(),
            dateMonth: date.getMonth() + 1,
            dateYear: date.getFullYear(),
            status,
            rating,
          },
          refetchQueries = status === BOOK_READ_STATUS.HAVE_READ ? ['userChallenge'] : ['userBooks', 'userChallenge']

    client.mutate({mutation, variables, refetchQueries, optimisticResponse: this.optimisticResponse})
    this.props.navigation.goBack()
  }

  optimisticResponse = (vars: any) => {
    return {
      changeStatus: {
        id: vars.bookId,
        userBookPartial: {
          bookRead: vars.status,
          dateDay: vars.dateDay,
          dateMonth: vars.dateMonth,
          dateYear: vars.dateYear,
          rating: vars.rating,
          __typename: 'UserBookPartial',
        },
        __typename: 'Book',
      },
    }
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
