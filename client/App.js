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
import OneSignal from 'react-native-onesignal';

const store = createStore(reducers);

export default class App extends Component {
  componentWillMount() {
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    //OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    //OneSignal.removeEventListener('ids', this.onIds);

    console.log(OneSignal.getTags())
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  /*
  onIds(device) {
    console.log('Device info: ', device);
  }*/

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
