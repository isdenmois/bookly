import React, { ReactChild, ReactNode, useCallback } from 'react';
import { Text, View, TouchableWithoutFeedback, TextStyle, ViewStyle, Platform } from 'react-native';
import { DynamicStyleSheet } from 'react-native-dynamic';
import { dynamicColor, light, useSColor } from 'types/colors';
import { navigation } from 'services';
import { TouchIcon } from 'components/touch-icon';

interface Props {
  style?: ViewStyle;
  modalStyle?: ViewStyle;
  title?: ReactChild;
  children: ReactNode;
  testID?: string;
  onApply?: () => void;
  onClose?: () => void;
}

export const Dialog = (props: Props) => {
  const { s, color } = useSColor(ds);
  const back = useCallback(() => {
    onBack();
    props.onClose?.();
  }, [props.onClose]);

  return (
    <View testID={props.testID} style={s.container}>
      <TouchableWithoutFeedback onPress={back}>
        <View style={s.backdrop} />
      </TouchableWithoutFeedback>

      <View style={s.modal}>
        <View style={[s.modalView, props.modalStyle]}>
          {!!props.title && renderDialogHeader(props.title, back, props.onApply, s, color)}
          <View style={[s.content, props.style]}>{props.children}</View>
        </View>
      </View>
    </View>
  );
};

function renderDialogHeader(title: ReactChild, back, onApply, s, color) {
  return (
    <View style={s.header}>
      <TouchIcon name='arrow-left' size={24} color={color.PrimaryText} onPress={back} />
      <Text numberOfLines={1} style={s.title}>
        {title}
      </Text>
      {onApply && <TouchIcon name='check' size={24} color={color.PrimaryText} onPress={onApply} />}
      {!onApply && <View style={s.noApplyIcon} />}
    </View>
  );
}

function onBack() {
  return navigation.pop();
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
    opacity: 0.5,
    position: 'absolute',
    backgroundColor: light.Black,
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
    backgroundColor: dynamicColor.Background,
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
