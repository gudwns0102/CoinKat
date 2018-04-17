import React from 'react'
import { StyleSheet, View, Text, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';

import * as Components from '../components/';
class BoardScreen extends React.Component {

  constructor(props){
    super(props);

  }

  componentDidMount(){

  }

  render(){
    return(
      <View style={styles.container}>
        <Components.BoardRow 
          name={'BTC'}
          data={{
            buy_price: 1000,
            opening_price: 1500000,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    width:'100%',
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
  }
})

export default withNavigation(BoardScreen);