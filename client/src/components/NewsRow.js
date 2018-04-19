import React from 'react'
import { StyleSheet, View, Text } from 'react-native';

const NewsRow = ({news}) => {

  
  
  return(
    <View style={styles.container}>
      <Text>This is NewsRow</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    width:'100%',
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
  }
})

export default NewsRow;