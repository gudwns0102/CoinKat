import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions } from 'react-native';
import { getHeaderImg } from '../lib';

/**
 * @param 
 */

const BoardRow = ({name, data}) => {
  const margin = Number(data['currentPrice']) - Number(data['openPrice']);
    const percent = (margin/Number(data['openPrice'])*100).toFixed(2);
    const delta = margin > 0 ? `▲ +${toLocaleString(margin)}원(+${percent}%)` : margin == 0 ? '0(0%)' : `▼ ${toLocaleString(margin)}(${percent}%)`;
    const textColor = margin > 0 ? styles.red : margin == 0 ? styles.black : styles.blue;

    return(
        <View style={styles.container}>
            <Image source={getHeaderImg(name)} style={styles.image}/>
            <Text style={{flex: 1, fontSize: 12}}>{name}{`\n`}</Text>
            <Text style={[{flex: 1, textAlign: 'right', fontSize: 12},textColor]}>{toLocaleString(data['currentPrice'])}원</Text>
            <Text style={[{flex: 1.8, textAlign: 'right', fontSize: 12},textColor]}>{delta}</Text>
        </View>
    );
}

const styles = StyleSheet.create({

  container:{      
      width: '100%',
      height: 60,
      flex: 1,
      flexDirection: 'row',
      alignItems:'center',
  },
  
  image:{
      width: 50, 
      height: 50, 
      margin: 5,
  },
  
  red:{
      color: 'rgba(194, 44, 24, 0.884)',
  },

  black:{
      color: 'black',
  },

  blue:{
    color: 'rgba(43, 72, 204, 0.884)'
  }
});

export default BoardRow;
