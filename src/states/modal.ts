import { StackNavigatorConfig, NavigationRouteConfigMap } from 'react-navigation'
import { ChangeStatusModal } from 'views/change-status/ChangeStatusModal'
import { TestModal } from 'TestModal'

export const ModalStack: NavigationRouteConfigMap = {
  TestModal: TestModal,
  ChangeStatus: ChangeStatusModal,
}
