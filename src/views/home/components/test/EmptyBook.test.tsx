import * as React from 'react'
import { shallow } from 'enzyme'
import { Button } from 'native-base'
import { TextL } from '../../../../components/Text'
import { EmptyBook } from '../EmptyBook'

describe('EmptyBook', function () {
  let component, onChooseBook

  beforeEach(function () {
    onChooseBook = jest.fn()
    component    = shallow(<EmptyBook onChooseBook={onChooseBook} chooseBookAvailable={true}/>)
  })

  it('should show text', function () {
    expect(component.find(TextL).prop('children')).toBe('Нет текущей читаемой книги')
  })

  it('should call chooseBook', function () {
    component.find(Button).simulate('press')

    expect(onChooseBook).toHaveBeenCalled()
  })
})
