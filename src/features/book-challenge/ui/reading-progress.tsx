import React, { FC, useCallback, useState } from 'react';
import { Svg, Circle, Text } from 'react-native-svg';
import { View } from 'react-native';
import { useStore } from '@nanostores/react';

import { $readBooksCountByChallenge } from 'entities/book';
import { $challengeCount } from 'entities/settings';
import { useTheme } from 'components/theme';

const STROKE_WIDTH = 10;
let priorSize = 139;

export const ReadingProgress: FC = () => {
  const readCount = useStore($readBooksCountByChallenge);
  const challengeCount = useStore($challengeCount);

  const { colors } = useTheme();
  const [size, setSize] = useState<number>(priorSize);

  const center = size / 2;
  const radius = size / 2 - STROKE_WIDTH / 2;
  const circumference = 2 * Math.PI * radius;

  const offset = (1 - readCount / challengeCount) * circumference;
  const onLayout = useCallback(
    e => {
      const width = e.nativeEvent.layout.width;

      if (width > 0 && size !== width) {
        priorSize = width;
        setSize(priorSize);
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
          {`${readCount} / ${challengeCount}`}
        </Text>
      </Svg>
    </View>
  );
};
