import * as React from 'react';
import { Dimensions, StyleSheet, View, ViewStyle } from 'react-native';
import Triangle from 'react-native-triangle';

export class LoginTriangles extends React.PureComponent<any> {
  width: number = 0;
  height: number = 0;

  constructor(props) {
    super(props);

    const { height, width } = Dimensions.get('window');

    this.height = height;
    this.width = width;
  }

  render() {
    const { height, width } = this,
      widthStep = width / 1.5,
      heightStep = height / 5;

    return (
      <View style={s.background}>
        <Triangle
          width={width * 2}
          height={height}
          direction='up-left'
          color='#71bac4'
          style={[s.triangle, { left: -widthStep / 2 }]}
        />
        <Triangle
          width={width * 2}
          height={height}
          direction='up-left'
          color='#20455b'
          style={[s.triangle, { left: -widthStep }]}
        />
        <Triangle
          width={width * 2}
          height={height}
          direction='up-left'
          color='#1c3a4c'
          style={[s.triangle, { left: -width }]}
        />
        <Triangle
          width={width * 2}
          height={height}
          direction='down-left'
          color='#2f9fad'
          style={[s.triangle, { top: heightStep }]}
        />
        <Triangle
          width={width * 2}
          height={height}
          direction='down-right'
          color='#f1631f'
          style={[s.triangle, { left: -widthStep / 2 }]}
        />
        <Triangle
          width={width * 2}
          height={height}
          direction='down-left'
          color='#b8e6e3'
          style={[s.triangle, { top: height * 0.7 }]}
        />
      </View>
    );
  }
}

const s = StyleSheet.create({
  background: {
    zIndex: -1,
    position: 'absolute',
  } as ViewStyle,
  triangle: {
    position: 'absolute',
  } as ViewStyle,
});
