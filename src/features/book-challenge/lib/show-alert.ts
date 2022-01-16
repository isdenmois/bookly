import { Alert, Platform } from 'react-native';

export const showAlert = text => (Platform.OS === 'web' ? window.alert(text) : Alert.alert('', text));
