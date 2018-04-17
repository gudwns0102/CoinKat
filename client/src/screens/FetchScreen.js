import React from 'react'
import { StyleSheet, View, Text, Image, AsyncStorage } from 'react-native';
import Parse from 'parse/react-native';

class FetchScreen extends React.Component {

  constructor(props){
    super(props);

  }

  componentDidMount(){
    Parse.setAsyncStorage(AsyncStorage);

    Parse.initialize('QWDUKSHKDWOP@osfight$HOFNDSESL#L');
    Parse.serverURL = 'http://13.125.101.187:1337/parse';

    Parse.User.enableUnsafeCurrentUser();

    Parse.User.currentAsync()
    .then(user => this.props.navigation.navigate(user ? 'MainStack' : 'AuthStack'))
    .catch(err => {
      console.log(error);
    })
  }

  render(){
    return(
      <View style={styles.container}>
        <Image source={require('../../assets/images/logo.png')} />
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

export default FetchScreen;