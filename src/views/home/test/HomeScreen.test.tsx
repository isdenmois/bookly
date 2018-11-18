import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { RefreshControl } from 'react-native'
import { client } from 'services/client'
import { HomeScreen } from '../HomeScreen'

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

  it('refresh', async function () {
    jest.spyOn(client, 'reFetchObservableQueries').mockImplementation(() => Promise.resolve())

    const promise = instance.refresh()

    expect(instance.state.refreshing).toBeTruthy()

    await promise

    expect(instance.state.refreshing).toBeFalsy()
  })
})
