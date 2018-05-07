import React from 'react'
import { StyleSheet, View, Image, AsyncStorage } from 'react-native';
import Parse from 'parse/react-native';
import axios from 'axios';

import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import * as actions from '../actions';

import OneSignal from 'react-native-onesignal';

class FetchScreen extends React.Component {
  
  onIds = async (device) => {
    const { pushToken, userId } = device;

    var user = await Parse.User.currentAsync();
    if(user){
      const OneSignal = Parse.Object.extend("OneSignal");
      const query = new Parse.Query(OneSignal);
      query.equalTo("parent", user);
      query.first({
        success: onesignal => {
          if(!onesignal){
            onesignal = new OneSignal();
            onesignal.set("parent", user);
          }
          onesignal.set("mobile_id", userId);
          onesignal.save(null)
          .then(() => this.props.navigation.navigate('MainStack'));
        },
        error: (onesignal, err) => console.log(err)
      })
    } else {
      this.props.navigation.navigate('AuthStack');
    }
  }

  async componentDidMount(){
    Parse.setAsyncStorage(AsyncStorage);
    Parse.initialize('QWDUKSHKDWOP@coinkat$HOFNDSESL#L');
    Parse.serverURL = 'https://api.coinkat.tk/parse';
    Parse.User.enableUnsafeCurrentUser();

    var { data } = await axios.get('https://api.coinkat.tk/all');
    this.props.setCoin(data);

    setInterval(async () => {
      var { data } = await axios.get('https://api.coinkat.tk/all');
      this.props.setCoin(data);
    }, 3000)

    var avatar = await AsyncStorage.getItem('avatar');
    this.props.setAvatar(avatar ? avatar : 'BTC');

    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount(){
    OneSignal.removeEventListener('ids', this.onIds);
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

const mapDispatchToProps = (dispatch) => {
  return {
    setCoin: coinData => dispatch(actions.setCoin(coinData)),
    setAvatar: coinName => dispatch(actions.setAvatar(coinName)),
  };
}

export default withNavigation(connect(null, mapDispatchToProps)(FetchScreen));