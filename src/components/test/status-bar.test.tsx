import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { Constants } from 'expo'
import { StatusBar } from '../status-bar'

describe('StatusBar', function () {
  let component: renderer.ReactTestRendererJSON

  beforeEach(function () {
    component = renderer.create(<StatusBar/>).toJSON()
  })

  it('should add styles', function () {
    expect(component.props.style[0].height).toBe(Constants.statusBarHeight)
  })
})
