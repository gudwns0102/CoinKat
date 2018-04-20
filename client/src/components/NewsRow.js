import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, Linking } from 'react-native';

import { getHeaderImg } from '../lib/';

const NewsRow = ({coin, news}) => {
  if(news.description == null){
    news.description = coin;
  }

  return (
    <TouchableOpacity onPress={() => Linking.openURL(news.url).catch(err => console.log(err))} style={styles.newsRow}>
      <Image 
        source={news.urlToImage ? {uri: news.urlToImage} : getHeaderImg(coin)} 
        style={{width: '30%', height:'90%', borderTopRightRadius: 10, borderBottomRightRadius: 10, marginRight: 10}}/>
      <Text style={{flex: 1}}>
        <Text style={{fontWeight: 'bold'}}>{news.title}{'\n'}</Text>
        <Text>
          {news.description.trim().replace(/\n/g, ' ').substring(0, 60)}
          {news.description.length > 100 ? '...' : ''}
        </Text>
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  newsRow: {
    width:'100%',
    flex: 1,
    flexDirection:'row',
    alignItems:'center'
  },
})

export default NewsRow;