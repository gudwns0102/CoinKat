import React from 'react'
import { StyleSheet, View, Text, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import Parse from 'parse/react-native';

import * as Components from '../components/';

import { connect } from 'react-redux';
import * as actions from '../actions';
import { withNavigation } from 'react-navigation';

class BoardScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      board: null,
    }
  }

  async componentDidMount(){
    this.props.setNav(this.props.navigation);
    const user = await Parse.User.currentAsync();
    const query = new Parse.Query(Parse.Object.extend("Board"));
    query.equalTo("parent", user);
    query.first({
      success: board => this.setState({board}),
      error: (board, err) => {
        alert("Board Fetch Failed... Network Error");
        this.setState({board: null});
      },
    })
    console.log(user.get("mobile_onesignal_id"))
  }

  render(){
    var { board } = this.state;

    if(!board){
      return (
        <View style={{height:'100%', alignItems:'center', justifyContent:'center'}}>
          <ActivityIndicator />
        </View>
      );
    }

    var boardData = board.get("data");
    var data = this.props.coinData;
    var items = {};

    for(var i in boardData){
      const { exchange, name } = boardData[i];
      var key = exchange + '-' + name;
      items[key] = {
        exchange,
        name,
        data: data[exchange][name],
      }
    }

    return(
      <View style={styles.container}>
        <Components.Board
          board={board}
          data={items} 
          callback={(exchange, name) => this.props.navigation.navigate('CoinDetailScreen', {exchange, name})}/>
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