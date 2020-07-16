import React, { useState, useMemo, useCallback } from 'react';
import { ScrollView, View, StyleSheet, ViewStyle } from 'react-native';
import { color, dark } from 'types/colors';
import { DynamicStyleSheet, DynamicValue, useDynamicValue } from 'react-native-dynamic';

const BUBLE_SIZE = 10;

interface Props {
  children: any;
  width?: number;
}

export function Carousel({ children, width }: Props) {
  const [offset, setOffset] = useState(0);
  const style: ViewStyle = useMemo(() => ({ width, overflow: 'hidden' }), [width]);
  const onScroll = useCallback(e => setOffset(e.nativeEvent.contentOffset.x), []);
  const ds = useDynamicValue(dynamicStyles);

  if (children?.length < 2) {
    return children;
  }

  return (
    <View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        onScroll={onScroll}
        scrollEventThrottle={50}
        style={style}
        pagingEnabled
        horizontal
      >
        {children.map((c, i) => (
          <View key={i} style={style}>
            {c}
          </View>
        ))}
      </ScrollView>

      <View style={s.bubbles}>
        {children.map((c, i) => (
          <View key={i} style={isFilled(width, offset, i) ? ds.filled : ds.empty} />
        ))}
      </View>
    </View>
  );
}

function isFilled(width, offset, i) {
  return Math.round(offset / width) === i;
}

const s = StyleSheet.create({
  bubbles: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 5,
  } as ViewStyle,
});

const dynamicStyles = new DynamicStyleSheet({
  empty: {
    width: BUBLE_SIZE,
    height: BUBLE_SIZE,
    backgroundColor: new DynamicValue(color.Border, dark.Border),
    borderRadius: 15,
    alignSelf: 'center',
    marginLeft: 1,
  },
  filled: {
    width: BUBLE_SIZE,
    height: BUBLE_SIZE,
    backgroundColor: new DynamicValue(color.Primary, dark.Primary),
    borderRadius: 15,
    alignSelf: 'center',
    marginLeft: 1,
  },
});
