import React from 'react'
import { StyleSheet, View, Text, PanResponder, Animated, Dimensions, TouchableOpacity } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { connect } from 'react-redux';
import * as actions from '../actions';

import { withNavigation, NavigationActions } from 'react-navigation';
import PubSub from 'pubsub-js';

const { width, height } = Dimensions.get('window');

class CKController extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      count: 0,
    }
  }

  componentWillMount(){
    PubSub.subscribe('CoinAddScreen-Count', (msg, count) => {
      console.log(this.state.count);
      console.log(count);
      this.setState({count});
    })

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
  
      onPanResponderGrant: (e, gestureState) => {
        // Set the initial value to the current state
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
      },
  
      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),
  
      onPanResponderRelease: (e, { vx, vy }) => {
        // Flatten the offset to avoid erratic behavior
        this.state.pan.flattenOffset();
      }
    });
  }

  render(){
    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }
    
    const boardScreenBtn = (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('CoinAddScreen')} style={{width:'100%', flex: 1, alignItems:'center', justifyContent:'center'}}> 
        <Ionicons name='ios-add' size={25} />
      </TouchableOpacity>
    );

    const coinAddScreenBtn = (
      <TouchableOpacity 
        onPress={() => PubSub.publish('CKControllerPress')} 
        style={[
          styles.circleWrapper,
          {backgroundColor: this.state.count != 0 ? 'rgba(141, 226, 71, 0.884)' : 'white'}]}>
        <Ionicons name={this.state.count != 0 ? 'ios-checkmark' : 'ios-close'} size={25} color={this.state.count != 0 ? 'white' : 'gray'}/>
        {this.state.count != 0 && 
          <View style={{
            position: 'absolute', 
            backgroundColor: 'rgba(231, 26, 26, 0.979)', 
            alignItems:'center',
            justifyContent:'center',
            top: 1, 
            right: 1, 
            width: 20, 
            height: 20, 
            borderRadius: 10}}>
            <Text style={{color: 'white'}}>{this.state.count}</Text>
          </View>}
      </TouchableOpacity>
    );

    const avatarSelectScreenBtn = (
      <TouchableOpacity onPress={() => PubSub.publish('CKControllerPress')} style={{width:'100%', flex: 1, alignItems:'center', justifyContent:'center'}}> 
        <Ionicons name='ios-close' size={25} />
      </TouchableOpacity>
    );

    var nav = this.props.navigation;
    var btn;

    if(nav == null){
      btn = boardScreenBtn;
    } else {
      var route = nav.state.key;
      
      if(route == 'BoardScreen'){
        btn = boardScreenBtn;
      } else if(route == 'CoinAddScreen'){
        btn = coinAddScreenBtn;
      } else if(route == 'AvatarSelectScreen'){
        btn = avatarSelectScreenBtn;
      }
    }
      
    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        style={[panStyle, styles.circle]}
      >
        {btn}
      </Animated.View>
    );
  }
}

let CIRCLE_RADIUS = 25;
const styles = StyleSheet.create({
  circle: {
    position:'absolute',
    bottom: 50,
    right: 30,
    backgroundColor: 'white',
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
    elevation: 10
  },

  circleWrapper: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
    alignItems:'center', 
    justifyContent:'center', 
  }
})

const mapStateToProps = (state) => {
  return {
    coinData: state.coinReducer.coinData,
    navigation: state.navReducer.nav,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCoin: coinData => dispatch(actions.setCoin(coinData)),
    setNav: nav => dispatch(actions.setNav(nav)),
  };
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(CKController));