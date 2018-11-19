import { NavigationRouteConfigMap } from 'react-navigation'
import { ChangeStatusModal } from 'views/change-status/change-status.modal'
import { BookSelectModal } from 'views/book-select/book-select.modal'

export const ModalStack: NavigationRouteConfigMap = {
  ChangeStatus: ChangeStatusModal,
  BookSelect: BookSelectModal,
}
