import { StackNavigatorConfig, NavigationRouteConfigMap } from 'react-navigation'
import { TestModal } from 'TestModal'

export const ModalStack: NavigationRouteConfigMap = {
  TestModal: TestModal,
}

export const ModalStackOptions: StackNavigatorConfig = {
  mode: 'card',
  headerMode: 'none',
  cardStyle: {
    backgroundColor: 'transparent',
    opacity: 1,
  },
}
