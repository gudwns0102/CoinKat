import React from 'react'
import { StyleSheet, View, Text, PanResponder, Animated, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
class CKPicker extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      dx: 0,
      dy: 0,
      value1: 0,
      value2: 0,
      rotateQuote: 0,
    };

    this.state.pan.x.addListener(({value}) => this._value = value);
    this.state.pan.y.addListener(({value}) => this._value = value);
  }

  getCurrentValue = () => {
    var { rotateQuote } = this.state;
    var result = Math.abs(rotateQuote) % 2 == 0 ? 'value1' : 'value2';
    return result;
  }

  componentDidMount(){   
  }

  componentWillMount() {
    this.setState({value1: this.props.initialValue, value2: this.props.initialValue}); 
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
  
      // Initially, set the value of x and y to 0 (the center of the screen)
      onPanResponderGrant: (e, gestureState) => {
        var { step, range } = this.props;
        var { upper, lower } = range;
        var r = this.props.radius;
        this.temp = setInterval(() => {
          this.setState((prevState) => {
            this.props.callback(this.state.value1, this.state.value2);
            var value = this.getCurrentValue();
            var newValue = prevState[value] + step * (-prevState.dy/r);
            newValue > upper ? newValue = upper : newValue < lower ? newValue = lower : null;
            var result = {};
            result[value] = Number(newValue.toFixed(1))
            return result;
          })
        }, 100)

        var result = Math.abs(this.state.rotateQuote) % 2 == 0 ? 0 : width/4;
        this.state.pan.setOffset({x: result, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
      },
  
      // When we drag/pan the object, set the delate to the states pan position
      onPanResponderMove: (e, gestureState) => {
        
        this.setState({dx: gestureState.dx, dy: gestureState.dy});
        return Animated.event([
          null, {dx: this.state.pan.x, dy: this.state.pan.y},
        ])(e, gestureState)
      },
  
      onPanResponderRelease: (e, {vx, vy}) => {
        clearInterval(this.temp);
        this.state.pan.flattenOffset();
        var dx = this.state.pan.x._value;
        var rotateQuote = Math.round(dx/width*720/180)
        var rotate = rotateQuote*180*width/720;
        this.setState({rotateQuote})
        this.props.callback(this.state.value1, this.state.value2);
        Animated.spring(this.state.pan.x, { toValue: rotate, friction: 3}).start();
      }
    });
  }

  render(){
    const { pan, dy, value1, value2 } = this.state;
    const { range } = this.props;
    const r = this.props.radius;
    
    var rotate = pan.x.interpolate({
      inputRange: [-width, width],
      outputRange: ['-720deg', '720deg']  // 0 : 150, 0.5 : 75, 1 : 0
    })
    
    const style = {
      width: 2*r,
      height: 2*r,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'white',
      transform: [
        {rotateY: rotate}
      ]
    }
    

    const view1 = (
      <TouchableOpacity style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center', 
      borderWidth: 10, 
      borderColor:'rgba(209, 68, 68, 0.979)',}}>
        <Text style={{fontSize: r/2, fontWeight: 'bold'}}>{value1}%</Text>
      </TouchableOpacity>
    );

    const view2 = (
      <TouchableOpacity style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center',
      borderWidth: 10, 
      borderColor:'rgba(60, 63, 196, 0.979)',
      transform:[
        {rotateY: 180/360*2*Math.PI}
      ]}}>
        <Text style={{fontSize: r/2, fontWeight: 'bold'}}>{value2}%</Text>
      </TouchableOpacity>
    );
    
    const currentRotateQuote = Math.round(parseInt(rotate.__getValue())/180);
    const currentView = currentRotateQuote % 2 == 0 ? view1 : view2;

    return(
      <Animated.View style={[style, this.props.style]} {...this._panResponder.panHandlers}>
        {currentView}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  circle:{
    width:'100%',
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
  }
})

export default CKPicker;