import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, ScrollView, AsyncStorage } from 'react-native';

import axios from 'axios';

import { getHeaderImg } from '../lib';

import { connect } from 'react-redux';
import * as actions from '../actions';
import { withNavigation } from 'react-navigation';

import PubSub from 'pubsub-js';

const { width, height } = Dimensions.get('window');
const layoutMin = width < height ? width : height;

class AvatarSelectScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      coins: [],
    }
    
    this.props.setNav(this.props.navigation);
    this.token = PubSub.subscribe('CKControllerPress', (msg, data) => {
      PubSub.unsubscribe(this.token);
      this.props.navigation.navigate('BoardScreen');
    })
  }

  async componentDidMount(){
    var { data } = await axios.get('https://api.coinkat.tk/reverseAll');
    var coins = Object.keys(data);

    this.setState({coins});
  }

  handleCoinPress = (coin) => {
    this.props.setAvatar(coin);
    this.props.navigation.goBack();
  }

  render(){
    const items = this.state.coins.map((coin, index) => {
      return (
        <TouchableOpacity key={index} style={styles.imageWrapper} onPress={() => this.handleCoinPress(coin)}>
          <Image style={{width:'100%', height:'100%'}} source={getHeaderImg(coin)} resizeMode='cover'/>
        </TouchableOpacity>
      );
    })
    
    return(
      <ScrollView>
        <View style={styles.container}>
          {items}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    width:'100%',
    flex: 1,
    flexDirection:'row',
    flexWrap:'wrap',
  },

  imageWrapper: {
    width:layoutMin/3,
    height:layoutMin/3,
  }
})

const mapDispatchToProps = (dispatch) => {
  return {
    setAvatar: coinName => dispatch(actions.setAvatar(coinName)),
    setNav: nav => dispatch(actions.setNav(nav))
  };
}

export default withNavigation(connect(null, mapDispatchToProps)(AvatarSelectScreen));