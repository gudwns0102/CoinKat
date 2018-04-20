import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator,Linking } from 'react-native';

import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import * as actions from '../actions';
import { getHeaderImg, translate2Origin } from '../lib/index';
import toLocaleString from '../lib/toLocaleString';

import * as Components from '../components';

import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PubSub from 'pubsub-js';
import Parse from 'parse/react-native';

import FCM from 'react-native-fcm';

const { width, height } = Dimensions.get('window');
const googleAPIKey = '232338aa4c4d4bfca82d9fada0000db3';

class CoinDetailScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      newsReady: undefined,
      news: null,
      upPercent: 0.1,
      downPercent: 0.1,
    }
  }

  handleRegister = async () => {
    const { exchange, name } = this.props.navigation.state.params;
    const data = this.props.coinData[exchange][name];
    const upPrice = parseInt(data.currentPrice * (1 + this.state.upPercent/100));
    const downPrice = parseInt(data.currentPrice * (1 - this.state.downPercent/100));

    const user = await Parse.User.currentAsync();
    const FCMToken = await FCM.getFCMToken();

    const Push = Parse.Object.extend("Push");
    const push = new Push();

    push.set("exchange", exchange);
    //push.exchange = exchange;
    push.set('name', name);

    push.set('upPrice', upPrice);
    push.set('downPrice', downPrice);

    push.set('parent', user);
    push.set('FCMToken', FCMToken);

    push.save(null, {
      success: result => {
        alert('Your push is registered successfully!')
      },
      error: (obj, err) => {
        alert('Network is not connected!')
      }
    })
  }

  componentDidMount(){
    this.token = PubSub.subscribe('CKControllerPress', () => {
      this.props.navigation.navigate('BoardScreen');
    })
    const { name } = this.props.navigation.state.params;
    this.props.setNav(this.props.navigation);
    axios.get(`https://newsapi.org/v2/everything?q=${translate2Origin(name)}&apiKey=${googleAPIKey}`)
    .then(result => {
      this.setState({newsReady: true, news: result.data.articles})
    })
    .catch(err => {
      this.setState({newsReady: false, news: null})
    })
  }

  render(){
    const { news, newsReady } = this.state;
    const { exchange, name } = this.props.navigation.state.params;
    const data = this.props.coinData[exchange][name];

    let newsView;

    if(newsReady){
      newsView = (
        <View style={{width:'100%', flex: 1, paddingBottom: '10%'}}>
          <Components.NewsRow news={news[0]} coin={name}/>
          <Components.NewsRow news={news[1]} coin={name}/>
        </View>
      );
    } else if(newsReady == undefined) {
      newsView = (
        <View style={{width:'100%', flex: 1, alignItems:'center', justifyContent:'center'}}>
          <ActivityIndicator />
        </View>
      );
    } else {
      newsView = (
        <View style={{width:'100%', flex: 1, alignItems:'center', justifyContent:'center'}}>
          <Text>Network is not connected...</Text>
        </View>
      )
    }

    return(
      <View style={styles.container}>
        <View style={styles.boardRowWrapper}>
          <View style={styles.boardRow}>
            <Components.BoardRow name={name} data={data}/>
          </View>
        </View>
        <View style={styles.newsWrapper}>
          <View style={styles.newsBar}>
            <TouchableOpacity style={{alignItems:'flex-end', marginRight: 7}}>
              <Ionicons name='md-remove' size={25} color='gray'/>
            </TouchableOpacity>
          </View>
          {newsView}
        </View>
        <View style={{width: '95%', flex: 1, backgroundColor:'white', marginTop: 10, marginBottom: 10, paddingTop: 10, paddingBottom: 10, borderRadius: 10, flexDirection:'row', alignItems:'center'}}>
          <Components.CKPicker 
            style={{marginLeft: 10, marginRight: 20, height: '100%', borderRadius: 10}}
            radius={60} 
            initialValue={0.1} 
            range={{upper: 15, lower: 0}} 
            step={0.1} 
            callback={(upPercent, downPercent) => this.setState({upPercent, downPercent})}/>
          <View style={styles.alarmTextBox}>
            <Text style={{fontFamily:'Comfortaa-Regular', lineHeight: 30}}>
              <Text>We'll send you push{'\n'}</Text>
              <Text>For <Text style={{textDecorationLine: 'underline', fontWeight:'bold', fontSize:20}}>{exchange} {name}{'\n'}</Text>If the price is: {'\n'}</Text>
              <Text style={{flex: 1, textAlign:'center'}}>rise up to {toLocaleString(parseInt(data.currentPrice * (1 + this.state.upPercent/100)))}{'\n'}</Text>
              <Text style={{flex: 1, textAlign:'center'}}>come down {toLocaleString(parseInt(data.currentPrice * (1 - this.state.downPercent/100)))}{'\n'}</Text>
            </Text>
            <TouchableOpacity onPress={this.handleRegister} style={styles.registerBtn}>
              <Text>Register Push</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    width:'100%',
    flex: 1,
    alignItems:'center',
  },

  boardRowWrapper: {
    width:'95%',
    height: '12%',
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'center',
    marginTop:10,
    marginBottom: 10,
    borderRadius: 10,
  },

  boardRow:{
    width: '95%',
    flex: 1,
  },

  newsWrapper: {
    width:'95%',
    height: '45%',
    backgroundColor:'white',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  newsBar:{
    width:'100%',
    height:'10%',
  },


  alarmTextBox: {
    height: '100%',
    flex: 1,
    justifyContent:'space-between'
  },

  registerBtn:{
    width:'90%',
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'gray',
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
    setNav: nav => dispatch(actions.setNav(nav))
  };
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(CoinDetailScreen));