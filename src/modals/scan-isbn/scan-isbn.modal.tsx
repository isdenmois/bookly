import React, { useCallback } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Dialog } from 'components';
import { NavigationStackProp } from 'react-navigation-stack';

interface Props {
  navigation: NavigationStackProp;
}

export function ScanIsbnModal({ navigation }: Props) {
  const onScan = useCallback(({ data }) => {
    if (!data) return;

    navigation.goBack();
    navigation.getParam('onScan')?.(data.replace(/-/g, ''));
  }, []);

  return (
    <Dialog style={s.d} title='Сканирование ISBN'>
      <View style={s.cameraRow}>
        <RNCamera
          style={s.camera}
          type={RNCamera.Constants.Type.back}
          captureAudio={false}
          onBarCodeRead={onScan}
          onFacesDetected={null}
          onTextRecognized={null}
        />
      </View>
    </Dialog>
  );
}

const s = StyleSheet.create({
  d: {
    paddingHorizontal: 20,
  } as ViewStyle,
  cameraRow: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  camera: {
    width: 200,
    height: 200,
  } as ViewStyle,
});
