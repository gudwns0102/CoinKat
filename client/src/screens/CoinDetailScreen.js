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
        <Components.CKPicker radius={60} initialValue={5} range={{upper: 15, lower: 5}} step={0.1} callback={(upPercent, downPercent) => this.setState({upPercent, downPercent})}/>
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
    height: '15%',
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
    height: '40%',
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