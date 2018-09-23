import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { Button } from 'native-base'
import { ProfileScreen } from '../ProfileScreen'

describe('ProfileScreen', function () {
  it('should logout on button click', function () {
    const sessionStore: any = {
            stopSession: jest.fn(),
          },
          navigation: any = {
            popToTop: jest.fn(),
            replace: jest.fn(),
          },
          component       = renderer.create(<ProfileScreen sessionStore={sessionStore} navigation={navigation}/>).root

    component.findByType(Button).props.onPress()

    expect(sessionStore.stopSession).toHaveBeenCalled()
    expect(navigation.popToTop).toHaveBeenCalled()
    expect(navigation.replace).toHaveBeenCalledWith('Login')
  })
})
