/**
 * Костыль для react 16.5
 * TODO: спилить при обновлении expo
 */

import * as React from 'react'
import { inject as iocInject, InjectorContext } from 'react-ioc'

type Constructor<T> = new (...args: any[]) => T

export const injectProviderContext = (Wrapped: any): any => {
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

export const injectContext = (Wrapped: any): any => {
  return (props: any) => (
    <InjectorContext.Consumer>
      {context => <Wrapped {...props} context={context}/>}
    </InjectorContext.Consumer>
  )
}

export function inject<T>(target: any, dep: Constructor<T>): T {
  if (target.props.context) {
    target.context = target.props.context
  }

  return iocInject(target, dep)
}
