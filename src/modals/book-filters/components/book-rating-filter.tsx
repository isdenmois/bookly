import React from 'react';
import { StyleSheet, ViewStyle, View } from 'react-native';
import { SwipeRating, formatRating } from 'components/rating';
import { Interval } from 'types/book-filters';
import { OpenableListItem } from './openable-list-item';

interface Props {
  value: Interval<number>;
  onChange: (type: string, value: Interval<number>) => void;
}

export class BookRatingFilter extends React.PureComponent<Props> {
  render() {
    return (
      <OpenableListItem title='Рейтинг' viewValue={formatRating(this.props.value)} onClear={this.clear}>
        <View style={s.row}>
          <SwipeRating value={this.props.value} onChange={this.setRating} />
        </View>
      </OpenableListItem>
    );
  }

  setRating = rating => this.props.onChange('rating', rating);
  clear = () => this.props.onChange('rating', null);
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
  } as ViewStyle,
});
