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
    AsyncStorage.getItem('order')
    .then(order =>
      this.setState({order: JSON.parse(order)})
    );
  }

  componentWillUnmount(){
    AsyncStorage.setItem('order', JSON.stringify(this.state.order));
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
          AsyncStorage.setItem('order', JSON.stringify(order));
          this.setState({order});
        }}
        renderRow={row => {
          return <TouchableHighlight style={{flex: 1, width}}>
            <BoardRow name={row.name} data={row.data} />
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