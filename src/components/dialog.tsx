import React, { ReactNode, useCallback } from 'react';
import { Text, View, TouchableWithoutFeedback, TextStyle, ViewStyle, Platform } from 'react-native';
import { DynamicStyleSheet } from 'react-native-dynamic';
import { dynamicColor, light, useSColor } from 'types/colors';
import { t } from 'services';
import { TouchIcon } from 'components/touch-icon';
import { useNavigation } from '@react-navigation/core';

interface Props {
  style?: ViewStyle;
  modalStyle?: ViewStyle;
  title?: string;
  children: ReactNode;
  testID?: string;
  rightIcon?: ReactNode;
  onApply?: () => void;
  onClose?: () => void;
}

export const Dialog = (props: Props) => {
  const navigation = useNavigation();

  const { s, color } = useSColor(ds);
  const back = useCallback(() => {
    navigation.goBack();
    props.onClose?.();
  }, [props.onClose]);

  return (
    <View testID={props.testID} style={s.container}>
      <TouchableWithoutFeedback onPress={back}>
        <View style={s.backdrop} />
      </TouchableWithoutFeedback>

      <View style={s.modal}>
        <View style={[s.modalView, props.modalStyle]}>
          {!!props.title && renderDialogHeader(props.title, back, props.rightIcon, props.onApply, s, color)}
          <View style={[s.content, props.style]}>{props.children}</View>
        </View>
      </View>
    </View>
  );
};

function renderDialogHeader(title: string, back, rightIcon, onApply, s, color) {
  return (
    <View style={s.header}>
      <TouchIcon name='arrow-left' size={24} color={color.PrimaryText} onPress={back} />
      <Text numberOfLines={1} style={s.title}>
        {t(title)}
      </Text>
      {onApply && <TouchIcon name='check' size={24} color={color.PrimaryText} onPress={onApply} />}
      {!onApply && <View style={s.noApplyIcon} />}
      {rightIcon}
    </View>
  );
}

const ds = new DynamicStyleSheet({
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
    opacity: 1,
    position: 'absolute',
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
    backgroundColor: dynamicColor.DialogBackground,
    flex: 1,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  } as ViewStyle,
  title: {
    color: dynamicColor.PrimaryText,
    fontSize: 24,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  } as TextStyle,
  content: {
    flexDirection: 'column',
    alignItems: 'stretch',
    maxHeight: Platform.OS === 'web' ? '80vh' : '100%',
  } as ViewStyle,
  noApplyIcon: {
    width: 24,
    height: 25,
  } as ViewStyle,
});
