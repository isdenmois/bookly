import { settings, syncService } from 'services';
import { ToastAndroid } from 'react-native';
import { useState, useCallback } from 'react';

export function useLoginStore() {
  const [login, setLogin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submit = useCallback(async () => {
    setSubmitting(true);
    const writableSettings: any = settings;

    try {
      writableSettings.userId = login;

      await syncService.sync();

      settings.set('userId', login);
    } catch (e) {
      ToastAndroid.show(e?.message || 'Не удалось войти', ToastAndroid.SHORT);

      writableSettings.userId = '';
    } finally {
      setLogin('');
      setSubmitting(false);
    }
  }, [login]);

  return { login, setLogin, submit, submitting };
}
