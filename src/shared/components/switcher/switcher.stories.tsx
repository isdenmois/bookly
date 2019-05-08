import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { State, Store } from '@sambego/storybook-state';
import { Switcher } from './switcher';

const store = new Store({
  active: 'WANT_TO_READ',
});

const statusOptions = [
  { key: 'NOW_READING', title: 'Читаю сейчас' },
  { key: 'WANT_TO_READ', title: 'Хочу прочитать' },
  { key: 'HAVE_READ', title: 'Прочитано' },
];

storiesOf('Switcher').add('Usage', () => (
  <State store={store}>
    {state => <Switcher options={statusOptions} value={state.active} onChange={active => store.set({ active })} />}
  </State>
));
