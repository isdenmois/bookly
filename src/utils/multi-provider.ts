import { createElement, FC } from 'react';

type Props = {
  providers: any[];
};

export const MultiProvider: FC<Props> = ({ providers, children }) => {
  return createProvider(providers, 0, children);
};

function createProvider(providers, i, children) {
  if (i >= providers.length) {
    return children;
  }
  const [Provider, props] = Array.isArray(providers[i]) ? providers[i] : [providers[i], {}];

  return createElement(Provider, props, createProvider(providers, i + 1, children));
}
