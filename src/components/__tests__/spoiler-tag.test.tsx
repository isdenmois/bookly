import React from 'react';
import { Text } from 'react-native';
import { create, act } from 'react-test-renderer';
import { color } from 'types/colors';
import { SpoilerText } from '../spoiler-tag';

it('SpoilerText', () => {
  const tree = create(<SpoilerText>test</SpoilerText>);
  const text = tree.root.findByType(Text);

  expect(text.props.style.backgroundColor).toBe(color.Review);

  act(() => text.props.onPress());

  expect(text.props.style.backgroundColor).toBe(color.LightBackground);
});
