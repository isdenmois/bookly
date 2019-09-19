import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-community/async-storage';

const hijackConsole = () => {
  const oldConsoleLog = console.log;

  console.log = (...args) => {
    oldConsoleLog(...args);

    Reactotron.display({
      name: 'CONSOLE.LOG',
      important: true,
      value: args,
      preview: args.length > 0 && typeof args[0] === 'string' ? args[0] : null,
    });
  };
};

hijackConsole();

Reactotron.configure()
  .setAsyncStorageHandler(AsyncStorage)
  .useReactNative()
  .connect();

Reactotron.clear();
