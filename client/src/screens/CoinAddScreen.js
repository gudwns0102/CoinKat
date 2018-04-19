import React from 'react'
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Dimensions, AsyncStorage } from 'react-native';

import { withNavigation } from 'react-navigation';

import { connect } from 'react-redux';
import * as actions from '../actions';

import { getHeaderImg } from '../lib/'; 

import * as Components from '../components';
import PubSub from 'pubsub-js';

const { width, height } = Dimensions.get('window');

class CoinAddScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      map: {},
      exchange: null,
      count: 0,
    }
  }

  async componentDidMount(){
    this.props.setNav(this.props.navigation);
    this.token = PubSub.subscribe('CKControllerPress', async (msg, data) => {
      var { map } = this.state;
      var order = await AsyncStorage.getItem('order');
      order = JSON.parse(order);

      Object.keys(map).map(exchange => {
        Object.keys(map[exchange]).map(coin => {
          if(map[exchange][coin]){
            order.push(exchange + '-' + coin);
          }
        })
      })

      await AsyncStorage.setItem('order', JSON.stringify(order));
      this.props.navigation.navigate('BoardScreen');
    })
    
    PubSub.publish('CoinAddScreen-Count', 0);

    var order = await AsyncStorage.getItem('order');
    order = JSON.parse(order);

    var map = {};

    var coinData = this.props.coinData;
    Object.keys(coinData).map(exchange => {
      map[exchange] = {};
      Object.keys(coinData[exchange]).map(coin => {
        if(!order.includes(exchange + '-' + coin)){
          map[exchange][coin] = false;
        }
      })
    })

    this.setState({map});
  }

  componentWillUnmount(){
    PubSub.unsubscribe(this.token);
  }

  handleExchangePress = (exchange) => {
    this.setState({exchange});
  }

  handleCoinPress = (coin) => {
    var { exchange, map, count } = this.state;
    var prev = map[exchange][coin];

    map[exchange][coin] = !prev;
    count = count + (prev ? -1 : 1); 

    this.setState({map, count});
    PubSub.publish('CoinAddScreen-Count', count);
  }


  render(){
    const { exchange, map } = this.state;
    const exchangeList = Object.keys(map);
    const coinList = exchange ? Object.keys(map[exchange]) : [];

    return(
      <View style={styles.container}>
        <FlatList 
          style={{height:'100%', flex: 1, backgroundColor:'white'}}
          data={exchangeList}
          renderItem={({item, index}) => (
            <TouchableOpacity key={index} style={{width:'100%', height: height*0.1, backgroundColor:'white'}} onPress={() => this.handleExchangePress(item)} underlayColor={'gray'}>
              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                <Image source={item == 'bithumb' ? require('../../assets/images/exchange/bithumb-logo.png') : require('../../assets/images/exchange/coinone-logo.png')} style={{width: 50, height: 50}}/>
                <Text style={{flex: 1, textAlign:'center'}}>{item}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <FlatList 
          style={{height:'100%', flex: 1, backgroundColor:'white'}}
          data={coinList}
          renderItem={({item, index}) => (
            <TouchableOpacity 
              key={index} 
              style={{width:'100%', height: height*0.1, backgroundColor:map[exchange][item] ? 'rgba(231, 26, 26, 0.979)' : 'white', flex: 1}} 
              onPress={() => this.handleCoinPress(item)}>
              <View style={{width:'100%', flex: 1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                <Image source={getHeaderImg(item)} style={{width: 30, height: 30, margin: 10}}/>
                <Text style={{flex: 1, textAlign:'center'}}>{item}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    width:'100%',
    flex: 1,
    flexDirection:'row',
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

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(CoinAddScreen));