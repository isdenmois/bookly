import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { bindings } from './inject';

const valueSymbol = Symbol('value');
const refSymbol = Symbol('ref');

export function asValue(key, value) {
  return { symbol: valueSymbol, key, value };
}

export function asRef(key, propName: string) {
  return { symbol: refSymbol, propName, key };
}

export const provider = (...definitions) => Wrapped => {
  class Provider extends React.Component {
    defined = createBindings(definitions);
    refProps = createRefProps(definitions);

    render() {
      const props = { ...this.props, ...this.refProps };

      return React.createElement(Wrapped, props);
    }

    componentWillUnmount() {
      this.defined.forEach(key => bindings.delete(key));
    }
  }

  return hoistNonReactStatics(Provider, Wrapped);
};

function createBindings(definitions: any[]) {
  const keys = [];

  definitions.forEach(definition => {
    if (definition.symbol === valueSymbol) {
      bindings.set(definition.key, definition.value);
      keys.push(definition.key);
      return;
    }

    if (definition.symbol === refSymbol) {
      if (typeof definition.key === 'function') {
        definition = definition.key;
      } else {
        keys.push(definition.key);
        return;
      }
    }

    bindings.set(definition, new definition());
    keys.push(definition);
  });

  return keys;
}

function createRefProps(definitions: any[]) {
  const result: any = {};

  definitions.forEach(definition => {
    if (definition.symbol === refSymbol) {
      if (typeof definition.key === 'function') {
        result[definition.propName] = bindings.get(definition.key).setRef;
      } else {
        result[definition.propName] = ref => bindings.set(definition.key, ref);
      }
    }
  });

  return result;
}
