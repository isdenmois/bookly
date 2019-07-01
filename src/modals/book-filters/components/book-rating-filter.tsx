import React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle, View, TouchableOpacity } from 'react-native';
import { ListItem } from 'components/list-item';
import { TouchIcon } from 'components/touch-icon';
import { SwipeRating, formatRating } from 'components/rating';

interface Props {
  value: string;
  onChange: (type: string, value: any) => void;
}

export class BookRatingFilter extends React.PureComponent<Props> {
  state = { opened: false };

  render() {
    const value: any = this.props.value || {};
    const { from, to } = value;
    const defined = Boolean(from && to);
    const opened = this.state.opened;

    return (
      <ListItem rowStyle={s.list} onPress={opened ? null : this.open}>
        {!opened && <Text style={s.title}>Рейтинг</Text>}
        {opened && (
          <View style={s.container}>
            <TouchableOpacity onPress={this.close}>
              <Text style={s.title}>Рейтинг</Text>
            </TouchableOpacity>

            <View style={s.row}>
              <SwipeRating value={value} onChange={this.setRating} />
            </View>
          </View>
        )}
        {defined && !opened && <Text style={s.value}>{formatRating(this.props.value)}</Text>}

        {defined && !opened && (
          <TouchIcon paddingVertical={15} paddingLeft={10} name='times' size={20} color='#000' onPress={this.clear} />
        )}
      </ListItem>
    );
  }

  open = () => this.setState({ opened: true });
  close = () => this.setState({ opened: false });

  setRating = value => {
    this.props.onChange('rating', value);
    this.close();
  };

  clear = () => this.props.onChange('rating', null);
}

const s = StyleSheet.create({
  list: {
    paddingVertical: 0,
  } as ViewStyle,
  title: {
    fontSize: 16,
    color: 'black',
    paddingVertical: 15,
  } as TextStyle,
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  } as ViewStyle,
  value: {
    fontSize: 16,
    color: 'black',
    flex: 1,
    textAlign: 'right',
  } as TextStyle,
});
