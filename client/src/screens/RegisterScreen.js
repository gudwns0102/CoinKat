import React from 'react'
import { StyleSheet, View, Text } from 'react-native';

class RegisterScreen extends React.Component {

  constructor(props){
    super(props);

  }

  render(){
    return(
      <View style={styles.container}>
        <Text>This is RegisterScreen</Text>
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

export default RegisterScreen;