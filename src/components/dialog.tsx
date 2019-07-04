import React, { ReactChild, ReactNode } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View, StyleSheet, TouchableWithoutFeedback, ViewStyle } from 'react-native';
import { TextL } from 'components/text';

interface Props extends NavigationScreenProps {
  style?: ViewStyle;
  modalStyle?: ViewStyle;
  title?: ReactChild;
  children: ReactNode;
}

export const Dialog = (props: Props) => (
  <View style={s.container}>
    <TouchableWithoutFeedback onPress={() => props.navigation.pop()}>
      <View style={s.backdrop} />
    </TouchableWithoutFeedback>

    <View style={s.modal}>
      <View style={[s.modalView, props.modalStyle]}>
        {props.title && (
          <View style={s.title}>
            <TextL>{props.title}</TextL>
          </View>
        )}
        <View style={[s.content, props.style]}>{props.children}</View>
      </View>
    </View>
  </View>
);

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
    backgroundColor: 'black',
  } as ViewStyle,
  modal: {
    marginVertical: 50,
    marginHorizontal: 20,
  } as ViewStyle,
  modalView: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'white',
  } as ViewStyle,
  title: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  } as ViewStyle,
  content: {
    flexDirection: 'column',
    alignItems: 'stretch',
    maxHeight: '100%',
  } as ViewStyle,
});
