import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { RefreshControl } from 'react-native'
import { HomeScreen } from '../home.screen'

describe('HomeScreen', function () {
  let component: ShallowWrapper<any, any, HomeScreen>,
    instance: HomeScreen,
    navigation: any = {}

  beforeEach(function () {
    component = shallow(<HomeScreen navigation={navigation}/>)
    instance = component.instance()
  })

  it('renderRefresh', function () {
    const tree = component.instance().renderRefresh()

    expect(tree.type).toBe(RefreshControl)
  })
})
