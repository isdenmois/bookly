import React, { memo, useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  type: string;
  onChange: (type: string) => void;
}

export const StatGroups = memo(({ type, onChange }: Props) => {
  const setByMonth = useCallback(() => onChange('MONTH'), []);
  const setByRating = useCallback(() => onChange('RATING'), []);
  const setByYear = useCallback(() => onChange('YEAR'), []);

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={type === 'MONTH' ? null : setByMonth}>
        <Text>По месяцам</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={type === 'RATING' ? null : setByRating}>
        <Text>По оценке</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={type === 'YEAR' ? null : setByYear}>
        <Text>По годам</Text>
      </TouchableOpacity>
    </View>
  );
});
