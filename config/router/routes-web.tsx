import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { PrivateRoute } from './private-route';

import { HomeScreen } from 'screens/home/home.screen';
import { LoginScreen } from 'screens/login/login.screen';
import { SearchScreen } from 'screens/search/search.screen';

export class Routes extends React.Component {
  render() {
    return (
      <Router>
        <>
          <PrivateRoute exact path='/' component={HomeScreen} />
          <PrivateRoute exact path='/search' component={SearchScreen} />
          <Route path='/login' component={LoginScreen} />
        </>
      </Router>
    );
  }
}
