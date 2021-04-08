import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Svg, G, Circle, Text, TSpan } from 'react-native-svg';
import { useTheme } from 'components/theme';
import { View } from 'react-native';

type Props = {
  readCount: number;
  totalBooks: number;
};

const STROKE_WIDTH = 10;

export const ReadingProgress: FC<Props> = ({ readCount, totalBooks }) => {
  const { colors } = useTheme();
  const [size, setSize] = useState<number>(0);

  const center = size / 2;
  const radius = size / 2 - STROKE_WIDTH / 2;
  const circumference = 2 * Math.PI * radius;

  const offset = (1 - readCount / totalBooks) * circumference;
  const onLayout = useCallback(
    e => {
      if (size !== e.nativeEvent.layout.width) {
        setSize(e.nativeEvent.layout.width);
      }
    },
    [size],
  );

  return (
    <View onLayout={onLayout}>
      <Svg width={size} height={size}>
        <Circle
          stroke={colors.grey10}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={STROKE_WIDTH}
          fill='transparent'
        />

        <Circle
          stroke={colors.Primary}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill='transparent'
          transform={`rotate(-90 ${center} ${center})`}
        />

        <Text
          x={center}
          y={center}
          fontSize={24}
          textAnchor='middle'
          stroke={colors.PrimaryText}
          fill={colors.PrimaryText}
          strokeWidth='1px'
          dy='.3em'
        >
          {`${readCount} / ${totalBooks}`}
        </Text>
      </Svg>
    </View>
  );
};
