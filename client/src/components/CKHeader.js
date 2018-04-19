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
  },

  menuView: {
    width:'12%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
  }
})

export default CKHeader;