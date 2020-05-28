import React from 'react';
import { render } from 'react-native-testing-library';
import { TextL, TextM, TextS, TextXL, TextXs } from '../text';

describe('Text', () => {
  it.each([
    ['Xs', TextXs, 11],
    ['S', TextS, 12],
    ['M', TextM, 16],
    ['L', TextL, 21],
    ['XL', TextXL, 24],
  ])('renders %s size', (title, Component, expected) => {
    const style = render(<Component testID='text' />).getByTestId('text').props.style;

    expect(style[0].fontSize).toBe(expected);
  });
});
