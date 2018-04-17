import React from 'react';
import { StackNavigator, SwitchNavigator } from 'react-navigation';
import AuthStack from './AuthStack';
import MainStack from './MainStack';

import * as Screens from '../screens';

// By default, SwitchNavigator do not maintain its member so back button never works like StackNavigator.
// Using this property, Auth flow can be implemented.
// For example, after switching to main navigator stack, 
// user cannot go back to auth navigator by back button, exactly what you want!

const RootNavigator = SwitchNavigator(
  {
    FetchScreen: {screen: () => <Screens.FetchScreen />},
    AuthStack: {screen: AuthStack},
    MainStack: {screen: MainStack},
  }
)

export default RootNavigator;