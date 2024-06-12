import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ing from '@page/Ing';
import Complete from '@page/Complete';

export type DeliveryStackParamList = {
  Ing: undefined;
  Complete: undefined;
};

export const DeliveryStack =
  createNativeStackNavigator<DeliveryStackParamList>();

export default function Delivery() {
  return (
    <DeliveryStack.Navigator initialRouteName="Ing">
      <DeliveryStack.Screen
        component={Ing}
        name="Ing"
        options={{headerShown: true}}
      />
      <DeliveryStack.Screen
        component={Complete}
        name="Complete"
        options={{headerShown: true}}
      />
    </DeliveryStack.Navigator>
  );
}
