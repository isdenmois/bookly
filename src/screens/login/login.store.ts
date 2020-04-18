import { session, syncService } from 'services';
import { ToastAndroid } from 'react-native';
import { useState, useCallback } from 'react';

export function useLoginStore(navigation, navigateTo: string) {
  const [login, setLogin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submit = useCallback(async () => {
    setSubmitting(true);

    session.set('userId', login);

    try {
      await syncService.sync();
    } catch (e) {
      ToastAndroid.show(e?.message || 'Не удалось войти', ToastAndroid.SHORT);
      session.set('userId', null);
      throw e;
    } finally {
      setLogin('');
      setSubmitting(false);
    }

    navigation.navigate(navigateTo);
  }, [login]);

  return { login, setLogin, submit, submitting };
}
