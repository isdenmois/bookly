import * as React from 'react'
import { shallow } from 'enzyme'
import { AsyncStorage } from 'react-native'
import { Button } from 'native-base'
import { ProfileScreen } from '../ProfileScreen'

describe('ProfileScreen', function () {
  it('should logout on button click', function () {
    const navigation: any = {
            popToTop: jest.fn(),
            replace: jest.fn(),
          },
          component       = shallow(<ProfileScreen navigation={navigation}/>)

    spyOn(AsyncStorage, 'setItem')

    component.find(Button).simulate('press')

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('SESSION_ID', null)
    expect(navigation.popToTop).toHaveBeenCalled()
    expect(navigation.replace).toHaveBeenCalledWith('Login')
  })
})
