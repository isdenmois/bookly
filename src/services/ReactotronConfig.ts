import Reactotron from 'reactotron-react-native'
import host from './host'

Reactotron
  .configure({host})
  .useReactNative({
    networking: {
      ignoreUrls: new RegExp(`(${host}:1900|symbolicate)`),
    },
    overlay: false,
  })
  .connect()

Reactotron.clear()
