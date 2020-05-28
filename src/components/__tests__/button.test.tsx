import React from 'react';
import { create } from 'react-test-renderer';
import { Text } from 'react-native';
import { Button } from '../button';

describe('Button', () => {
  it('renders button', () => {
    const tree = create(<Button label='Superb' />);

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('renders icon', () => {
    const tree = create(<Button label='Test' icon={<Text />} />);

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('renders disabled', () => {
    const tree = create(<Button label="You won't click me" disabled />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
