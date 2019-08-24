import React, { ReactChild, ReactNode, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback, TextStyle, ViewStyle } from 'react-native';
import { color } from 'types/colors';
import { Navigation, inject } from 'services';
import { TouchIcon } from 'components/touch-icon';

interface Props {
  style?: ViewStyle;
  modalStyle?: ViewStyle;
  title?: ReactChild;
  children: ReactNode;
  testID?: string;
  onApply?: () => void;
}

export const Dialog = (props: Props) => {
  return (
    <View testID={props.testID} style={s.container}>
      <TouchableWithoutFeedback onPress={onBack}>
        <View style={s.backdrop} />
      </TouchableWithoutFeedback>

      <View style={s.modal}>
        <View style={[s.modalView, props.modalStyle]}>
          {!!props.title && renderDialogHeader(props.title, props.onApply)}
          <View style={[s.content, props.style]}>{props.children}</View>
        </View>
      </View>
    </View>
  );
};

function renderDialogHeader(title: ReactChild, onApply) {
  return (
    <View style={s.header}>
      <TouchIcon name='arrow-left' size={24} color={color.PrimaryText} onPress={onBack} />
      <Text numberOfLines={1} style={s.title}>
        {title}
      </Text>
      {onApply && <TouchIcon name='check' size={24} color={color.PrimaryText} onPress={onApply} />}
      {!onApply && <View style={s.noApplyIcon} />}
    </View>
  );
}

function onBack() {
  const navigation = inject(Navigation);

  return navigation.pop();
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  } as ViewStyle,
  backdrop: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
    position: 'absolute',
    backgroundColor: color.Black,
  } as ViewStyle,
  modal: {
    marginTop: 50,
    marginBottom: 100,
    paddingHorizontal: 20,
    maxWidth: 400,
    alignSelf: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
  } as ViewStyle,
  modalView: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: color.Background,
    flex: 1,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  } as ViewStyle,
  title: {
    color: color.PrimaryText,
    fontSize: 24,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  } as TextStyle,
  content: {
    flexDirection: 'column',
    alignItems: 'stretch',
    maxHeight: '100%',
  } as ViewStyle,
  noApplyIcon: {
    width: 24,
    height: 25,
  } as ViewStyle,
});
