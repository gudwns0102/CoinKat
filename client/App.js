/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import * as Components from './src/components';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducers from './src/reducers';
import RootNavigator from './src/navigators';

const store = createStore(reducers);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <View style={{width:'100%', flex: 1}}>
          <RootNavigator />
        </View>
      </Provider>
    );
  }
}
