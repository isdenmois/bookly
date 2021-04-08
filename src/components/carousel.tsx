import React, { useState, useMemo, useCallback } from 'react';
import { ScrollView, View, StyleSheet, ViewStyle } from 'react-native';
import { color, dark } from 'types/colors';
import { DynamicStyleSheet, DynamicValue, useDynamicValue } from 'react-native-dynamic';

const BUBLE_SIZE = 5;

interface Props {
  children: any;
  width?: number;
  onIndexChange?: (index: number) => void;
}

export function Carousel({ children, width, onIndexChange }: Props) {
  const [currentSlide, setSlide] = useState(0);
  const style: ViewStyle = useMemo(() => ({ width, overflow: 'hidden' }), [width]);
  const onScroll = useCallback(
    e => {
      const index = Math.round(e.nativeEvent.contentOffset.x / width);

      if (index !== currentSlide) {
        setSlide(index);
        onIndexChange?.(index);
      }
    },
    [currentSlide, width, children.length],
  );
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
          <View key={i} style={i === currentSlide ? ds.filled : ds.empty} />
        ))}
      </View>
    </View>
  );
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
    borderRadius: BUBLE_SIZE,
    alignSelf: 'center',
    marginLeft: 3,
  },
  filled: {
    width: BUBLE_SIZE,
    height: BUBLE_SIZE,
    backgroundColor: new DynamicValue(color.Primary, dark.Primary),
    borderRadius: BUBLE_SIZE,
    alignSelf: 'center',
    marginLeft: 3,
  },
});
