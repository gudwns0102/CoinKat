import React from 'react'
import { StyleSheet, View, Text, Image, AsyncStorage } from 'react-native';
import Parse from 'parse/react-native';

import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import * as actions from '../actions';

import axios from 'axios';

import FCM, { FCMEvent, RemoteNotificationResult } from 'react-native-fcm';

class FetchScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      nextStack: null,
    }
  }

  async componentDidMount(){
    Parse.setAsyncStorage(AsyncStorage);

    Parse.initialize('QWDUKSHKDWOP@coinkat$HOFNDSESL#L');
    Parse.serverURL = 'https://api.coinkat.tk/parse';

    Parse.User.enableUnsafeCurrentUser();

    Parse.User.currentAsync()
    .then(user => {
      console.log('...');
      this.setState({nextStack: user ? 'MainStack' : 'AuthStack' })
    })
    .catch(err => {
      console.log("???")
      console.log(error);
    })

    var FCMToken = await FCM.getFCMToken()
    var user = await Parse.User.currentAsync();
    console.log(user)
    if(user){
      user.set('FCMToken', FCMToken);
      await user.save();
    }
    
    var { data } = await axios.get('https://api.coinkat.tk/all');
    this.props.setCoin(data);

    setInterval(async () => {
      var { data } = await axios.get('https://api.coinkat.tk/all');
      this.props.setCoin(data);
    }, 3000)

    var avatar = await AsyncStorage.getItem('avatar');
    this.props.setAvatar(avatar ? avatar : 'BTC');

    this.props.navigation.navigate(this.state.nextStack)

    /*
    var order = await AsyncStorage.getItem('order');
    if(order == null || order == []){
      AsyncStorage.setItem('order', JSON.stringify([]))
      .then(result => this.props.navigation.navigate(this.state.nextStack))
    } else {
      this.props.navigation.navigate(this.state.nextStack)
    }*/
  }

  render(){
    return(
      <View style={styles.container}>
        <Image source={require('../../assets/images/logo.png')} />
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
    setAvatar: coinName => dispatch(actions.setAvatar(coinName)),
  };
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(FetchScreen));