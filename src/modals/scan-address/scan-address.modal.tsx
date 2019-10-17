import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ViewStyle, Linking } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Dialog, ListItem, Button } from 'components';
import { NavigationStackProp } from 'react-navigation-stack';
import { color } from 'types/colors';
import { inject, Session } from 'services';

interface Props {
  navigation: NavigationStackProp;
}

export function ScanAddressModal({ navigation }: Props) {
  const session = useMemo(() => inject(Session), []);
  const [address, setAddress] = useState(session.lastAddress);
  const [scan, setScan] = useState(false);
  const openScan = useCallback(() => setScan(true), []);
  const openManager = useCallback(() => {
    if (!address) return;

    session.set('lastAddress', address);
    navigation.goBack();
    Linking.openURL(`http://${address}:8080`);
  }, [address]);
  const onScan = useCallback(({ data }) => {
    if (!data) return;

    setScan(false);
    setAddress(data.replace('http://', '').replace(':8080', ''));
  }, []);

  return (
    <Dialog style={s.d} title='Адрес'>
      {!scan && (
        <View>
          <ListItem
            value={address}
            onChange={setAddress}
            onSubmit={openManager}
            keyboardType='decimal-pad'
            icon={<Icon name='edit' size={16} color={color.PrimaryText} />}
          />
          <ListItem
            value='Сканировать'
            icon={<Icon name='qrcode' size={16} color={color.PrimaryText} />}
            onPress={openScan}
          />
        </View>
      )}
      {scan && (
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
      )}
      <Button style={s.button} label='Продолжить' disabled={scan || !address} onPress={openManager} />
    </Dialog>
  );
}

const s = StyleSheet.create({
  d: {
    paddingHorizontal: 20,
  } as ViewStyle,
  button: {
    marginTop: 20,
    marginBottom: 30,
    alignSelf: 'center',
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
