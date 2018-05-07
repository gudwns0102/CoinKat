import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableWithoutFeedback,
  Keyboard, 
  Animated, 
  Dimensions, 
  TouchableOpacity, 
  Image, 
  ImageBackground, 
  KeyboardAvoidingView,
  Button
} from 'react-native';

import FBSDK, { LoginButton, AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import Parse from 'parse/react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Sae } from 'react-native-textinput-effects';

import * as actions from '../actions';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

class LoginScreen extends React.Component{

  constructor(props){
    super(props);

    const { width, height } = Dimensions.get('window');
    
    this.windowHeight = height;

    this.state = {
      pageLoadOpacity: new Animated.Value(0),
      inputFormTouch: new Animated.Value(0),
      username: '',
      password: '',
    };
  }

  componentWillMount(){
    Keyboard.addListener('keyboardDidShow',this._keyboardShow)
    Keyboard.addListener('keyboardDidHide',this._keyboardHide)
  }

  componentDidMount(){
    Animated.timing(
      this.state.pageLoadOpacity,
      {
        toValue: 1,
        duration: 1200,
      }
    ).start();
  }

  _keyboardShow = () => {
    const height = this.windowHeight;
    Animated.timing(
      this.state.inputFormTouch,
      {
        toValue: 1,
        duration: 600,
      }
    ).start();
  }

  _keyboardHide = () => {
    const height = this.windowHeight;
    Animated.timing(
      this.state.inputFormTouch,
      {
        toValue: 0,
        duration: 600,
      }
    ).start();
  }

  handleLogin = () => {
    const { navigation } = this.props;
    Parse.User.logIn(this.state.username, this.state.password, {
      success: user => navigation.navigate('MainStack'),
      error: err => alert(err),
    })
  }

  handleFacebookLogin = (data) => {
    const { navigation } = this.props;
    const { userID, accessToken, expirationTime } = data;
    var authData = {
      id: userID,
      access_token: accessToken,
      expiration_date: expirationTime
    };

    Parse.FacebookUtils.logIn(authData, {
      success: (user) => {
        navigation.navigate('MainStack');
      },
      error : (user, error) => {
        console.log(error);
        LoginManager.logOut();
        switch (error.code) {
          case Parse.Error.INVALID_SESSION_TOKEN:
            Parse.User.logOut().then(() => {
              this.onFacebookLogin(token);
            });
            break;

          default: {
            console.log(error);
            alert("error");
          }
        }
      }
    })
  }

  render(){
      const { history, setLogin } = this.props;
      const { width, height } = Dimensions.get('window');

      const pageLoadStyle = {
        flex: 1,
        width: '100%',
        paddingLeft: '5%',
        paddingRight: '5%',
        opacity: this.state.pageLoadOpacity,
        marginTop: this.state.pageLoadOpacity.interpolate({
          inputRange: [0,1],
          outputRange: ['10%', '0%']
        }), 
      }

      const usernameTextInput = (
        <Sae
          style={{width: '80%', height: 30}}
          label={'User ID'}
          labelStyle={{color: 'white', fontWeight: 'normal', fontFamily: 'Raleway-Thin'}}
          iconClass={Icon}
          iconName={'pencil'}
          iconColor={'white'}
          // TextInput props
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={(text)=>this.setState({username: text})}
        />
      )

      const passwordTextInput = (
        <Sae
          style={{width: '80%', height: 30}}
          label={'Password'}
          labelStyle={{color: 'white', fontWeight: 'normal', fontFamily: 'Raleway-Thin'}}
          iconClass={Icon}
          iconName={'pencil'}
          iconColor={'white'}
          // TextInput props
          fontFamily={'Comfortaa_Regular'}
          secureTextEntry={true}
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={(text)=>this.setState({password: text})}
        />
      )

      const headerStyle = {
        height: this.state.inputFormTouch.interpolate({
          inputRange: [0, 1],
          outputRange: ['50%', '20%']
        }),
        width: '100%', 
        justifyContent:'center', 
        alignItems:'center',
        opacity: this.state.inputFormTouch.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0]
        })
      }

      const buttonStyle = {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
      }

      
      const loginButton = (
        <TouchableOpacity style={[buttonStyle, {backgroundColor: 'rgba(47, 145, 99, 0.925)', marginRight: 20}]} onPress={this.handleLogin}>
          <Icon style={{fontSize: 18, color:'white'}} name="sign-in"/><Text style={{fontFamily: 'Comfortaa_Regular', color: 'white'}}>  Login</Text>
        </TouchableOpacity>
      )

      const RegisterButton = (
        <TouchableOpacity style={[buttonStyle, {backgroundColor: 'rgba(245, 163, 187, 1)'}]}>
          <Icon style={{fontSize: 18, color: 'white'}} name="user-plus"/><Text style={{fontFamily: 'Comfortaa_Regular', color: 'white'}}>  Register</Text>
        </TouchableOpacity>
      )

      const facebookButton = 
      <LoginButton
        style={{width: '80%', height: 30}}
        publishPermissions={["publish_actions"]}
        onLoginFinished={
          (error, result) => {
            if (error) {
              alert("login has error: " + result.error);
            } else if (result.isCancelled) {
              alert("login is cancelled.");
            } else {
              AccessToken.getCurrentAccessToken()
              .then(this.handleFacebookLogin)
            }
          }
        }
        onLogoutFinished={this.handleFacebookLogout}/>

      return (
        <ImageBackground
          source={require('../../assets/images/auth.jpg')}
          imageStyle={{resizeMode: 'cover'}}
          blurRadius={1}
          style={styles.fullScreen}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{width:'90%', height:'90%', backgroundColor:'#393750', alignItems:'center'}}>
              <Animated.Image 
                style={{width: 100, height: 100, marginTop: '10%', opacity: this.state.pageLoadOpacity,}} 
                resizeMode='contain' 
                source={require('../../assets/images/logo-white.png')} />
              <View style={{flex: 1, width:'100%', alignItems:'center', justifyContent:'flex-end', marginBottom: '20%'}}>
                {usernameTextInput}
                {passwordTextInput}
                <View style={{marginTop: 20, marginBottom: 10, width:'80%', height: 30, flexDirection:'row'}}>
                  {loginButton}
                  {RegisterButton}
                </View>
                {facebookButton}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      )

      return(          
        <ImageBackground
          source={require('../../assets/images/auth.jpg')}
          imageStyle={{resizeMode: 'cover'}}
          blurRadius={1}
          style={styles.fullScreen}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <View style={{width:'90%', height:'90%', backgroundColor:'rgba(255,255,255,0.5)'}}>
              <Animated.View style={pageLoadStyle}>
                <Animated.View style={headerStyle}>
                  <Image style={{width: 60, height: 60}} resizeMode='contain' source={require('../../assets/images/logo.png')} />
                  <Text style={{fontFamily: 'Comfortaa_Regular', fontSize: 40, color: 'white'}}>CoinKat</Text>
                </Animated.View>  
                <View style={{flex: 1, alignItems:'center'}}>
                  {usernameTextInput}
                  {passwordTextInput}
                  <View style={{marginTop: 20, marginBottom: 20, width:'80%', flexDirection:'row'}}>
                    {loginButton}
                    {RegisterButton}
                  </View>
                  {facebookButton}
                </View>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      )
    }
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    width: '100%',
    alignItems:'center',
    justifyContent:'center'
  }
})

export default withNavigation(LoginScreen);