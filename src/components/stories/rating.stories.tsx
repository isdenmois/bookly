import React from 'react';
import { Text, View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { State, Store } from '@sambego/storybook-state';
import { Rating, RatingSelect, SwipeRating } from '../rating';

const store = new Store({
  rating: 3,
  select: 5,
});

storiesOf('Rating')
  .add('Simple', () => <Rating value={5} />)
  .add('Select', () => (
    <State store={store}>
      {state => <RatingSelect value={state.select} onChange={select => store.set({ select })} />}
    </State>
  ))
  .add('SwipeRating', () => (
    <View style={{ paddingHorizontal: 20 }}>
      <State store={store}>
        {state => (
          <>
            <SwipeRating value={state.rating} onChange={(rating: any) => store.set({ rating })} />
            <Text>{JSON.stringify(state.rating)}</Text>
          </>
        )}
      </State>
    </View>
  ));
