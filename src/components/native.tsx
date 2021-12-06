import React, { FC, useEffect, useRef } from 'react';
import { findNodeHandle, requireNativeComponent, UIManager } from 'react-native';

interface StatProps {
  text: string;
}

const StatisticsView = requireNativeComponent<any>('StatisticsView');

export const Statistics: FC<StatProps> = ({ text }) => {
  const ref = useRef();

  return <StatisticsView text={text} style={{ width: '100%', height: '100%' }} ref={ref} />;
};
