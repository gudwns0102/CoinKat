import React from 'react'
import { StyleSheet, View, Text, Image, AsyncStorage, TouchableOpacity } from 'react-native';

import { getHeaderImg } from '../lib';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import * as Components from '../components';

class CKDrawer extends React.Component {
  constructor(props){
    super(props);

  }

  render(){
    var {coinData, avatar} = this.props;

    return(
      <View style={styles.container}>
        <TouchableOpacity 
          onPress={() => this.props.navigation.navigate('AvatarSelectScreen')}
          style={{flex: 1, width:'100%', flexDirection: 'row', alignItems:'center'}}>
          <Image source={getHeaderImg(avatar)} style={styles.avatar}/>
          <Text style={{fontWeight: 'bold'}}>{avatar}</Text>
        </TouchableOpacity>
        <View>

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
    justifyContent:'center',
  },

  avatar: {
    width: 50,
    height: 50,
    margin: 10,
  }
})

const mapStateToProps = (state) => {
  return {
    coinData: state.coinReducer.coinData,
    avatar: state.avatarReducer.avatar,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCoin: coinData => dispatch(actions.setCoin(coinData)),
  };
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(CKDrawer));