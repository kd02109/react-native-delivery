import React from 'react';
import {Order} from '@/type';
import Config from 'react-native-config';

import FastImage from 'react-native-fast-image';
import {Dimensions, StyleSheet} from 'react-native';

interface Props {
  data: Order;
}

export default function CustomImage({data}: Props) {
  return (
    <FastImage
      source={{uri: `${Config.API_URL}/${data.image}` || ''}}
      resizeMode="contain"
      style={styles.image}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').width / 3,
  },
});
