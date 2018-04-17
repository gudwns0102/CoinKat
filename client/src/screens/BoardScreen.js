import React from 'react'
import { StyleSheet, View, Text, Alert } from 'react-native';

class BoardScreen extends React.Component {

  constructor(props){
    super(props);

  }

  componentDidMount(){
    
  }

  render(){
    return(
      <View style={styles.container}>
        <Text>This is BoardScreen</Text>
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

export default BoardScreen;