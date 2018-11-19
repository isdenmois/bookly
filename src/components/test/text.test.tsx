import * as React from 'react'
import * as renderer from 'react-test-renderer'
import * as theme from '../../constants/theme'
import { TextL, TextM, TextS } from '../text'

describe('Text components', function () {
  it('should set font size', function () {
    const textS = renderer.create(<TextS/>).toJSON(),
          textM = renderer.create(<TextM/>).toJSON(),
          textL = renderer.create(<TextL/>).toJSON()

    expect(textS.props.style[0].fontSize).toBe(theme.textS)
    expect(textM.props.style[0].fontSize).toBe(theme.textM)
    expect(textL.props.style[0].fontSize).toBe(theme.textL)
  })
})
