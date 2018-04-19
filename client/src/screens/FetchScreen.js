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
    Parse.serverURL = 'http://13.125.101.187:1337/parse';

    Parse.User.enableUnsafeCurrentUser();

    Parse.User.currentAsync()
    .then(user => this.setState({nextStack: user ? 'MainStack' : 'AuthStack' }))
    .catch(err => {
      console.log(error);
    })

    FCM.requestPermissions();
    FCM.getFCMToken().then(token => {
      console.log("TOKEN (getFCMToken)", token);
    });
    FCM.getInitialNotification().then(notif => {
      console.log("INITIAL NOTIFICATION", notif)
    });
    

    var user = await Parse.User.currentAsync();
    var { data } = await axios.get('http://13.125.101.187:1337/all');
    var avatar = await AsyncStorage.getItem('avatar');
    var order = await AsyncStorage.getItem('order');

    this.setState({nextStack: user ? 'MainStack' : 'AuthStack' })
    this.props.setCoin(data);
    this.props.setAvatar(avatar ? avatar : 'BTC');
    if(order == null || order == []){
      AsyncStorage.setItem('order', JSON.stringify(['bithumb-BTC', 'bithumb-ETH']))
      .then(result => this.props.navigation.navigate(this.state.nextStack))
    } else {
      this.props.navigation.navigate(this.state.nextStack)
    }

    setInterval(async () => {
      var { data } = await axios.get('http://13.125.101.187:1337/all');
      this.props.setCoin(data);
    }, 3000)

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