import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import apiClient from './api/apiClient';

const client = apiClient();
const EntryPoint = () => {
  const sendRequests = () => {
    const batchUrl = '/file-batch-api';

    client
      .get(batchUrl, {params: {ids: ['fileid1', 'fileid2']}})
      .then(response => {
        console.log('resp 1 -->', response);
      });
    client.get(batchUrl, {params: {ids: ['fileid2']}}).then(response => {
      console.log('resp 2 -->', response);
    });
    client.get(batchUrl, {params: {ids: ['fileid1']}}).then(response => {
      console.log('resp 3 -->', response);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => sendRequests()}>
        <Text>Click</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FAD6D6',
    width: '60%',
    padding: 20,
    alignItems: 'center',
  },
});
export default EntryPoint;
