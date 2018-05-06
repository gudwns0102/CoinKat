import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

class CKHeader extends React.Component {

  constructor(props){
    super(props);

  }

  render(){
    return(
      <View style={styles.container}>
        <TouchableOpacity style={styles.menuView} onPress={() => this.props.navigation.navigate('DrawerToggle')}>
          <Icon name='md-menu' size={25} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    width:'100%',
    flex: 1,
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor:'white',
//    shadow: '0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28)', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    zIndex: 100
    //shadowColor, shadowOffset, shadowOpacity, shadowRadius
  },

  menuView: {
    width:'12%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
  }
})

export default CKHeader;