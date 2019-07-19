import React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { bindings } from './inject'

const valueSymbol = Symbol('value')

export function asValue(key, value) {
  return { symbol: valueSymbol, key, value }
}

export const provider = (...definitions) => Wrapped => {
  class Provider extends React.Component {
    defined = createBindings(definitions)

    render() {
      return React.createElement(Wrapped, this.props);
    }

    componentWillUnmount() {
      this.defined.forEach(key => bindings.delete(key))
    }
  }

  return hoistNonReactStatics(Provider, Wrapped);
}

function createBindings(definitions: any[]) {
  const keys = []

  definitions.forEach(definition => {
    if (definition.symbol === valueSymbol) {
      bindings.set(definition.key, definition.value)
      keys.push(definition.key)
      return;
    }

    bindings.set(definition, new definition());
    keys.push(definition)
  })

  return keys;
}
