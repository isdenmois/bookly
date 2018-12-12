/**
 * Костыль для react 16.5
 * TODO: спилить при обновлении expo
 */

import * as React from 'react'
import { InjectorContext } from 'react-ioc'

export const injectContext = (Wrapped: any): any => {
  const original = Wrapped
  const Context = function (props) {
    original.call(this, props, props.context)
  } as any

  Context.prototype = original.prototype
  Context.displayName = `InjectorContext(${original.displayName})`
  Context.navigationOptions = original.navigationOptions

  return (props: any) => (
    <InjectorContext.Consumer>
      {context => <Context {...props} context={context}/>}
    </InjectorContext.Consumer>
  )
}
