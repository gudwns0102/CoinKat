import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import * as Screens from '../screens';

const AuthStack = StackNavigator(
  {
    LoginScreen: {screen: () => <Screens.LoginScreen />},
    RegisterScreen: {screen: () => <Screens.RegisterScreen />}
  },
  {
    navigationOptions: {
      headerStyle: {
        height: 0,
      },
    }
  }
)

export default AuthStack;