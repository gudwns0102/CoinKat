import React from 'react'
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Dimensions, AsyncStorage, ActivityIndicator } from 'react-native';

import { withNavigation } from 'react-navigation';

import { connect } from 'react-redux';
import * as actions from '../actions';

import { getHeaderImg, getExchangeImg } from '../lib/'; 

import * as Components from '../components';
import PubSub from 'pubsub-js';

import Parse from 'parse/react-native';

const { width, height } = Dimensions.get('window');

class CoinAddScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      map: null,
      exchange: null,
      count: 0,
      board: null,
    }
  }

  async componentDidMount(){
    this.props.setNav(this.props.navigation);
    const user = await Parse.User.currentAsync();
    const query = new Parse.Query(Parse.Object.extend("Board"));
    query.equalTo("parent", user);
    query.first({
      success: board => {
        this.token = PubSub.subscribe('CKControllerPress', async (msg, data) => {
          var { map } = this.state;
          var boardData = board.get("data");
          Object.keys(map).map(exchange => {
            Object.keys(map[exchange]).map(name => {
              if(map[exchange][name]){
                boardData.push({exchange, name})
              }
            })
          })
            
          board.set("data", boardData);
          board.save(null, {
            success: board => this.props.navigation.navigate('BoardScreen'),
            error: (board, err) => this.props.navigation.navigate('BoardScreen'),
          });
        })

        PubSub.publish('CoinAddScreen-Count', 0);

        var map = {};
        var boardData = board.get("data");
        console.log(boardData)
        var coinData = this.props.coinData;
        console.log(coinData);
        Object.keys(coinData).map(exchange => {
          console.log(exchange);
          map[exchange] = {};
          Object.keys(coinData[exchange]).map(name => {
            if(boardData.findIndex(item => item.exchange == exchange && item.name == name) == -1){
              map[exchange][name] = false;
            }
          })
          console.log(map);
        })

        console.log(map, board)

        this.setState({map, board});
      },
      error: (board, err) => {
        console.log(err);
      }
    })
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
    const { exchange, map, board } = this.state;

    if(board == null || map == null){
      return (
        <View>
          <ActivityIndicator />
        </View>
      )
    }

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
                <Image source={getExchangeImg(item)} style={{width: 50, height: 50}}/>
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