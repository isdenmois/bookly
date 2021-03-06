import React, { useCallback } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Dialog } from 'components';
import { ModalRoutes, ModalScreenProps } from 'navigation/routes';

type Props = ModalScreenProps<ModalRoutes.ScanIsbn>;

export function ScanIsbnModal({ navigation, route }: Props) {
  const onScan = useCallback(({ data }) => {
    const emit = route.params.onScan;
    if (!data || emit.e) return;

    emit.e = true;
    emit(data.replace(/-/g, ''));
    navigation.goBack();
  }, []);

  return (
    <Dialog style={s.d} title='modal.scan-isbn'>
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
