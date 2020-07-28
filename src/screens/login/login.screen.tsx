import React from 'react';
import { ActivityIndicator, View, Button, KeyboardAvoidingView, ViewStyle, TextStyle } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { TextL, ListItem } from 'components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { dynamicColor, useSColor } from 'types/colors';

import { LoginTriangles } from './login-triangles';
import { useLoginStore } from './login.store';
import { DynamicStyleSheet } from 'react-native-dynamic';

interface Props {
  navigation: NavigationScreenProp<any>;
  location: any;
}

export function LoginScreen({ navigation, location }: Props) {
  const navigateTo = location?.state.from?.pathname || 'Home';
  const { login, setLogin, submit, submitting } = useLoginStore(navigation, navigateTo);
  const { s, color } = useSColor(ds);

  return (
    <View style={s.container}>
      <LoginTriangles />

      <KeyboardAvoidingView style={s.cardContainer} behavior='padding' enabled>
        <View>
          <TextL style={s.headerTitle}>Вход в аккаунт</TextL>
        </View>

        <View style={s.card}>
          <ListItem
            testID='loginField'
            autoCapitalize='none'
            autoFocus
            placeholder='Имя пользователя'
            value={login}
            onChange={setLogin}
            onSubmit={submit}
            icon={<Icon name='user' size={18} color={color.PrimaryText} />}
          />

          {submitting && <ActivityIndicator size='large' color={color.Primary} />}

          {!submitting && <Button testID='submitButton' title='Войти' disabled={!login} onPress={submit} />}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const ds = new DynamicStyleSheet({
  container: {
    backgroundColor: '#b8e6e3',
    flex: 1,
    overflow: 'hidden',
  } as ViewStyle,
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  card: {
    backgroundColor: dynamicColor.Background,
    marginHorizontal: 20,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderRadius: 5,
    width: 300,
  } as ViewStyle,
  header: {
    marginBottom: 20,
  } as ViewStyle,
  headerTitle: {
    textAlign: 'center',
    color: 'white',
  } as TextStyle,
});
