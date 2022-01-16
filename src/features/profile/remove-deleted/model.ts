import { atom } from 'nanostores';
import { Alert, ToastAndroid } from 'react-native';
import { api } from 'services';

export const $isRemoving = atom(false);

export async function removeDeleted() {
  $isRemoving.set(true);

  try {
    const { deleted } = await api.removeDeleted();

    const message = deleted > 0 ? `Были удалено ${deleted} записей` : 'Удаленных записей не обнаружено';

    ToastAndroid.show(message, ToastAndroid.SHORT);
  } catch (e) {
    Alert.alert('Error', e?.message ?? "Can't remove deleted");
  }

  $isRemoving.set(false);
}
