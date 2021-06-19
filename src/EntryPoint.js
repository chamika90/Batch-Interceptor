import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import apiClient from './api/apiClient';

const client = apiClient();
const batchUrl = '/file-batch-api';

const sendRequests = () => {
  // Should batch in to one request
  client
    .get(batchUrl, {params: {ids: ['fileid1', 'fileid2']}})
    .then(({data}) => console.log('resp ', data))
    .catch(error => console.log('error', error));

  client
    .get(batchUrl, {params: {ids: ['fileid2']}})
    .then(({data}) => console.log('resp  ', data))
    .catch(error => console.log('error', error));

  // This should reject as the fileid3 is missing from the response;
  client
    .get(batchUrl, {params: {ids: ['fileid3']}})
    .then(({data}) => console.log('resp ', data))
    .catch(error => console.log('error', error));
};
const EntryPoint = () => {
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
