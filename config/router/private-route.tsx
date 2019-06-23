import React from 'react';
import { omit } from 'rambdax';
import { Route, Redirect } from 'react-router-dom';
import { inject, InjectorContext } from 'react-ioc';
import { Session } from 'services/session';

export class PrivateRoute extends React.Component<any> {
  static contextType = InjectorContext;

  session = inject(this, Session);

  get isAuthenticated() {
    return !!this.session.userId;
  }

  renderRoute = props => {
    if (this.isAuthenticated) {
      const { component: Component } = this.props;

      return <Component {...props} />;
    }

    const to = {
      pathname: '/login',
      state: { from: props.location },
    };

    return <Redirect to={to} />;
  };

  render() {
    const rest = omit('component', this.props);

    return <Route {...rest} render={this.renderRoute} />;
  }
}
