import OrderItem from '@/components/OrderItem';
import {useAppSelector} from '@/store';
import React from 'react';
import {FlatList, View} from 'react-native';

export default function Orders() {
  const orders = useAppSelector(state => state.order.orders);
  return (
    <View>
      <FlatList
        data={orders}
        keyExtractor={item => item.orderId}
        renderItem={item => <OrderItem {...item} />}
      />
    </View>
  );
}
