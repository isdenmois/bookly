import React from 'react';
import { times } from 'rambdax';
import { View, StyleSheet, ViewStyle, TextStyle, PanResponder } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color } from 'types/colors';
import { TextM } from 'components/text';

const SIZE = 10;

type SwipeInterval = { from: number; to: number };

interface SwipeRatingProps {
  value: number | SwipeInterval;
  size?: number;
  style?: ViewStyle;
  onChange?: (value: SwipeInterval) => void;
}

interface SwiperRatingState {
  start?: number;
  from: number;
  to: number;
  initFrom?: number;
  initTo?: number;
}

const valueFromProps = value => {
  const isObject = value && typeof value === 'object';
  const from = ((isObject ? +(value as SwipeInterval).from : +value) || 0) - 1;
  const to = ((isObject ? +(value as SwipeInterval).to : +value) || 0) - 1;

  return { from, to };
};

export function formatRating(rating: any): string {
  if (!rating) {
    return '';
  }

  if (typeof rating !== 'object') {
    return rating.toString();
  }

  if (rating.from < 0) {
    return '';
  }

  if (rating.from === rating.to) {
    return rating.from || '';
  }

  return `${rating.from} - ${rating.to}`;
}

export class SwipeRating extends React.PureComponent<SwipeRatingProps, SwiperRatingState> {
  static defaultProps: Partial<SwipeRatingProps> = { size: SIZE };

  static getDerivedStateFromProps(nextProps: SwipeRatingProps, prevState: SwiperRatingState) {
    const { from, to } = valueFromProps(nextProps.value);

    if (!prevState || (prevState.initFrom === from && prevState.initTo === to)) {
      return null;
    }

    return { start: -1, from, to, initFrom: from, initTo: to };
  }

  state: SwiperRatingState = { from: -1, to: -1 };

  width: number = 23;
  left: number;
  start: number;
  marker: View = null;

  private pan = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderTerminationRequest: () => true,
    onPanResponderStart: ev => this.updateFrom(ev.nativeEvent.pageX),
    onPanResponderMove: ev => this.updateTo(ev.nativeEvent.pageX),
    onPanResponderRelease: () => {
      const from = this.state.from + 1;
      const to = this.state.to + 1;

      this.props.onChange({ from, to });
    },
  });

  renderStars = times(index => (
    <Icon
      key={index}
      onLayout={index === 0 ? this.setStarWidth : null}
      style={s.star}
      name='star'
      size={22}
      solid={index >= this.state.from && index <= this.state.to}
    />
  ));

  getValue(pageX) {
    return Math.floor((pageX - this.left) / this.width);
  }

  updateFrom(pageX) {
    const from = this.getValue(pageX);

    this.setState({ start: from, from, to: from });
  }

  updateTo(pageX) {
    let start = this.state.start;
    let from = this.state.start;
    let to = Math.floor((pageX - this.left) / this.width);

    if (to >= this.props.size) {
      to = this.props.size - 1;
    }

    if (to < 0) {
      to = 0;
    }

    if (to < start) {
      [from, to] = [to, start];
    }

    if (this.state.from !== from || this.state.to !== to) {
      this.setState({ from, to });
    }
  }

  render() {
    const { size, style } = this.props;

    return (
      <View style={[s.container, style]}>
        <TextM style={s.text}>{formatRating({ from: this.state.from + 1, to: this.state.to + 1 })}</TextM>

        <View style={s.stars} {...this.pan.panHandlers} ref={this.setViewRef} onLayout={this.setLayout}>
          {this.renderStars(size)}
        </View>
      </View>
    );
  }

  setViewRef = marker => {
    this.marker = marker;
    this.setLayout();
  };

  setLayout = () => this.marker && this.marker.measure((x, y, width, height, pageX) => (this.left = pageX));
  setStarWidth = ev => (this.width = ev.nativeEvent.layout.width);
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  star: {
    color: color.Stars,
  } as TextStyle,
  stars: {
    flexDirection: 'row',
  } as ViewStyle,
  text: {
    width: 50,
    color: color.PrimaryText,
  } as TextStyle,
});
