import useHeightAnimation from '@/hook/useHeightAnimation';
import getDistanceFromLatLonInKm from '@/lib/getDistanceFromLatLonInKm';
import {Order} from '@/type';
import React, {useState} from 'react';

import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ListRenderItemInfo,
} from 'react-native';
import Animated from 'react-native-reanimated';

export default function OrderItem(props: ListRenderItemInfo<Order>) {
  const start = props.item.start;
  const end = props.item.end;
  const [isOpen, setIsOpen] = useState(false);
  const [height, animatedStyles] = useHeightAnimation(300);

  const onToggle = () => {
    setIsOpen(prev => !prev);
    height.value = isOpen ? 0 : 100;
  };

  const onAccept = async () => {};

  const onReject = async () => {};
  return (
    <View style={styles.orderContainer}>
      <Pressable onPress={onToggle}>
        <View style={styles.info}>
          <Text style={styles.eachInfo}>
            {props.item.price.toLocaleString('en-US')}
          </Text>
          <Text style={styles.eachInfo}>
            {getDistanceFromLatLonInKm(
              start.latitude,
              start.longitude,
              end.latitude,
              end.longitude,
            ).toFixed(2)}
            Km
          </Text>
        </View>
        <Animated.View style={animatedStyles}>
          {isOpen && (
            <View>
              <View>
                <Text>네이버 맵</Text>
              </View>
              <View style={styles.buttonWrapper}>
                <Pressable onPress={onAccept} style={styles.acceptButton}>
                  <Text style={styles.buttonText}>수락</Text>
                </Pressable>
                <Pressable onPress={onReject} style={styles.rejectButton}>
                  <Text style={styles.buttonText}>거절</Text>
                </Pressable>
              </View>
            </View>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  orderContainer: {
    borderRadius: 5,
    margin: 5,
    padding: 10,
    backgroundColor: 'lightgray',
  },
  info: {
    flexDirection: 'row',
  },
  eachInfo: {
    flex: 1,
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    flex: 1,
  },
  rejectButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
