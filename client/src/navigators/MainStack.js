import React from 'react';
import { TabNavigator } from 'react-navigation';

import * as Screens from '../screens';

const MainStack = TabNavigator(
  {
    Board: {screen: () => <Screens.BoardScreen />},
  },
  {
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    lazy: false,
    removeClippedSubviews: true,
    tabBarOptions: {
    
    }
  }
);

export default MainStack;