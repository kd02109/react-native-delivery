import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ing from '@page/Ing';
import Complete from '@page/Complete';

const Stack = createNativeStackNavigator();

export default function Delivery() {
  return (
    <Stack.Navigator initialRouteName="Ing">
      <Stack.Screen component={Ing} name="Ing" options={{headerShown: false}} />
      <Stack.Screen
        component={Complete}
        name="Complete"
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
