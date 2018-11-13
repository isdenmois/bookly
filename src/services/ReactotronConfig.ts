import Reactotron from 'reactotron-react-native'
import host from './host'

Reactotron
  .configure({host})
  .useReactNative({
    networking: {
      ignoreUrls: new RegExp(`(${host}:19000|symbolicate)`),
    },
    overlay: false,
  })
  .connect()

Reactotron.log('Hello world')
