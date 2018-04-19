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

const { width, height } = Dimensions.get('window');
const googleAPIKey = '232338aa4c4d4bfca82d9fada0000db3';

const NewsRow = ({coin, news}) => {
  if(news.description == null){
    news.description = coin;
  }

  return (
    <TouchableOpacity onPress={() => Linking.openURL(news.url).catch(err => console.log(err))} style={styles.newsRow}>
      <Image 
        source={news.urlToImage ? {uri: news.urlToImage} : getHeaderImg(coin)} 
        style={{width: '30%', height:'90%', borderTopRightRadius: 10, borderBottomRightRadius: 10, marginRight: 10}}/>
      <Text style={{flex: 1}}>
        <Text style={{fontWeight: 'bold'}}>{news.title}{'\n'}</Text>
        <Text>
          {news.description.trim().replace(/\n/g, ' ').substring(0, 60)}
          {news.description.length > 100 ? '...' : ''}
        </Text>
      </Text>
    </TouchableOpacity>
  );
}

class CoinDetailScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      newsReady: undefined,
      news: null,
      upPercent: 5,
      downPercent: 5,
    }
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
          <NewsRow news={news[0]} coin={name}/>
          <NewsRow news={news[1]} coin={name}/>
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
            initialValue={5} 
            range={{upper: 15, lower: 5}} 
            step={0.1} 
            callback={(upPercent, downPercent) => this.setState({upPercent, downPercent})}/>
          <View style={styles.alarmTextBox}>
            <Text style={{fontFamily:'Comfortaa-Regular', lineHeight: 30}}>
              <Text>We'll send you push{'\n'}</Text>
              <Text>For <Text style={{textDecorationLine: 'underline', fontWeight:'bold', fontSize:20}}>{exchange} {name}{'\n'}</Text>If the price is: {'\n'}</Text>
              <Text style={{flex: 1, textAlign:'center'}}>rise up to {toLocaleString(parseInt(data.currentPrice * (1 + this.state.upPercent/100)))}{'\n'}</Text>
              <Text style={{flex: 1, textAlign:'center'}}>come down {toLocaleString(parseInt(data.currentPrice * (1 - this.state.downPercent/100)))}{'\n'}</Text>
            </Text>
            <TouchableOpacity style={styles.registerBtn}>
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

  newsRow: {
    width:'100%',
    flex: 1,
    flexDirection:'row',
    alignItems:'center'
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