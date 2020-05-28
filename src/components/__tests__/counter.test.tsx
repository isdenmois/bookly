import React from 'react';
import { create } from 'react-test-renderer';
import { Counter } from '../counter';

it('Counter', () => {
  const tree = create(<Counter value={10} label='Total' />);

  expect(tree.toJSON()).toMatchSnapshot();
});
