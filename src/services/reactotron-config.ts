import Reactotron from 'reactotron-react-native'
import host from './host'

(console as any).tron = Reactotron

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
