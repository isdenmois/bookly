import * as React from 'react'
import { observer } from 'mobx-react'
import { inject, InjectorContext } from 'react-ioc'
import { NavigationScreenProps } from 'react-navigation'
import { Updates } from 'expo'
import { ToastAndroid } from 'react-native'

import { Container, Content, List, ListItem, Text } from 'native-base'

import { APP_VERSION } from 'constants/version'
import { DataContext, Session } from 'services'
import { TextM } from 'components/text'

interface Props extends NavigationScreenProps {
}

@observer
export class ProfileScreen extends React.Component<Props> {
  static navigationOptions = {headerTitle: 'Профиль'}
  static contextType = InjectorContext

  session = inject(this, Session)
  dataContext = inject(this, DataContext)

  render() {
    return (
      <Container>
        <Content>
          <List>
            <ListItem itemHeader first>
              <Text>Версия: {APP_VERSION}</Text>
            </ListItem>

            <ListItem last button onPress={this.checkForUpdates}>
              <TextM>Проверить обновления</TextM>
            </ListItem>

            <ListItem last button onPress={this.clearCache}>
              <TextM>Сбросить кеш</TextM>
            </ListItem>

            <ListItem last button onPress={this.logout}>
              <TextM>Выйти</TextM>
            </ListItem>
          </List>
        </Content>
      </Container>
    )
  }

  checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync()

      if (update.isAvailable) {
        ToastAndroid.show('Доступно обновление', ToastAndroid.SHORT)

        await Updates.fetchUpdateAsync()

        ToastAndroid.show('Приложение было обновлено', ToastAndroid.SHORT)

        Updates.reloadFromCache()
      } else {
        ToastAndroid.show('Нет доступных обновлений', ToastAndroid.SHORT)
      }

    } catch (e) {
      ToastAndroid.show('Не удалось получить обновления', ToastAndroid.LONG)
    }
  }

  clearCache = () => {
    this.dataContext.reload()
    ToastAndroid.show('Кеш сброшен', ToastAndroid.LONG)
  }

  logout = () => {
    this.session.stopSession()
    this.props.navigation.navigate('Login')
  }
}
