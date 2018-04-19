import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import * as Screens from '../screens';
import * as Components from '../components';
import { AvatarSelectScreen } from '../screens';

const DrawerStack = DrawerNavigator(
  {
    BoardScreen: {screen: () => <Screens.BoardScreen />},
    AvatarSelectScreen: {screen: () => <Screens.AvatarSelectScreen />},
    CoinAddScreen: {screen: () => <Screens.CoinAddScreen />},
    CoinDetailScreen: {screen: () => <Screens.CoinDetailScreen />}
  },
  {
    contentComponent: ({navigation}) => (
      <View style={{width:'100%', flex: 1}}>
        <Components.CKDrawer navigation={navigation}/>
      </View>
    ),
  }
)

const MainStack = StackNavigator(
  {
    Drawer: {screen: DrawerStack},
  },
  {
    navigationOptions: ({navigation}) => ({
      header: (
        <View style={{width:'100%', height:'8%', alignItems:'center', justifyContent:'center'}}>
          <Components.CKHeader navigation={navigation}/>
        </View>
      ),
    })
  }
);

export default MainStack;