import React from 'react'
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  AsyncStorage } from 'react-native';
import BoardRow from './BoardRow';

import SortableListView from 'react-native-sortable-listview';
import Parse from 'parse/react-native';
/**
 * @param Object $data Coin Information Object
 */

class Board extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      order: [],
    }
  }

  componentDidMount(){
    var data = this.props.data;
    var order = [];
    Object.keys(data).map(key => {
      order.push(key);
    });

    this.setState({order});
  }

  async componentWillUnmount(){
    const { order } = this.state;
    const boardData = [];
    
    for(var i in order){
      const key = order[i].split('-');
      const exchange = key[0];
      const name = key[1];
      boardData.push({
        exchange,
        name,
      })
    }

    const user = await Parse.User.currentAsync();
    const query = new Parse.Query(Parse.Object.extend("Board"));
    query.equalTo("parent", user);
    query.first({
      success: board => {
        board.set("data", boardData);
        board.save();
      },
      error: (board, err) => {
        alert("Network error! Your board change is not saved")
      }
    })
  }

  render(){
    const {width} = Dimensions.get('window');

    return (
      <SortableListView
        style={{width:'100%', flex: 1}}
        data={this.props.data}
        order={this.state.order}
        onRowMoved={e => {
          var order = this.state.order;
          order.splice(e.to, 0, order.splice(e.from, 1)[0]);
          this.setState({order});
        }}
        renderRow={row => {
          return <TouchableHighlight style={{flex: 1, width}} onPress={() => this.props.callback(row.exchange, row.name)}>
            <BoardRow name={row.name} data={row.data}/>
          </TouchableHighlight>
        }}
      />
    )

    return(
      <FlatList
        style={{width:'100%'}}
        data={this.props.data}
        renderItem={({item}) => (
          <BoardRow
            name={item.name}
            data={item.data}
          />
        )}       
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
}

export default Board;