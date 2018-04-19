import React from 'react'
import { StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';

import * as Components from '../components/';

import { connect } from 'react-redux';
import * as actions from '../actions';

import FCM from 'react-native-fcm';


class BoardScreen extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount(){
    FCM.getFCMToken().then(token => console.log(token));
    this.props.setNav(this.props.navigation);
  }

  render(){
    var data = this.props.coinData;
    var items = {};

    Object.keys(data).map(exchange => {
      Object.keys(data[exchange]).map(name => {
        var key = exchange + '-' + name;
        items[key] = {
          exchange,
          name,
          data: data[exchange][name],
        };
      })
    })

    return(
      <View style={styles.container}>
        <Components.Board data={items}/>
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

const mapStateToProps = (state) => {
  return {
    coinData: state.coinReducer.coinData,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCoin: coinData => dispatch(actions.setCoin(coinData)),
    setNav: nav => dispatch(actions.setNav(nav))
  };
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(BoardScreen));