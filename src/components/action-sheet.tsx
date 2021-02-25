import React, { useEffect, useMemo } from 'react';
import { Animated, View, Text, TouchableWithoutFeedback, TouchableOpacity, Platform } from 'react-native';
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dynamic';
import { dynamicColor, light } from 'types/colors';
import { navigation, t } from 'services';
import { confirm } from 'screens/details/components/book-details-lines';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface Action {
  id: string;
  label: string;
  dangerous?: boolean;
}

type Props = {
  actions: Action[];
  onSelect(actionId: string): void;
};

const paddingBottom = Platform.OS === 'web' ? 50 : 0;

export function ActionSheet({ actions, onSelect }: Props) {
  const s = useDynamicStyleSheet(ds);
  const value = useMemo(() => new Animated.Value(0), []);
  const sheetStyle = useMemo(
    () => ({
      transform: [
        {
          translateY: value.interpolate({ inputRange: [0, 1], outputRange: [actions.length * 46 + paddingBottom, 0] }),
        },
      ],
    }),
    [actions.length],
  );

  useEffect(() => {
    Animated.timing(value, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={s.modal}>
      <TouchableWithoutFeedback onPress={onBack}>
        <View style={s.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View style={[s.container, { paddingBottom }, sheetStyle]}>
        {actions.map(action => (
          <TouchableOpacity key={action.id} style={s.item} onPress={() => select(action, onSelect)}>
            <Text style={[s.text, action.dangerous && s.dangerous]}>{t(action.label)}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
}

function onBack() {
  return navigation.pop();
}

function select(action: Action, onSelect) {
  onBack();

  if (action.dangerous) {
    confirm('Are you sure?').then(() => onSelect(action.id));
  } else {
    setTimeout(() => onSelect(action.id));
  }
}

const ds = new DynamicStyleSheet({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  backdrop: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
    position: 'absolute',
    backgroundColor: light.Black,
  },
  container: {
    backgroundColor: dynamicColor.DialogBackground,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  text: {
    fontSize: 16,
    color: dynamicColor.PrimaryText,
  },
  dangerous: {
    color: dynamicColor.ErrorText,
  },
});
