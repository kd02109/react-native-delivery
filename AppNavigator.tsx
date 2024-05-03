import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Settings from '@page/Settings';
import Orders from '@page/Orders';
import Delivery from '@page/Delivery';
import React, {useEffect} from 'react';
import SignIn from '@page/SignIn';
import SignUp from '@page/SignUp';
import {useAppDispatch, useAppSelector} from '@/store';
import {postWithRefreshToken} from '@/api';
import {Alert} from 'react-native';
import {UserState, userSlice} from '@/slice/user';
import useSocket from '@/hook/useSocket';
import {orderSlice} from '@/slice/order';
import {Order} from '@/type';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();
export default function AppNavigator() {
  const isLoggedIn = useAppSelector(state => !!state.user.email);
  const dispatch = useAppDispatch();
  const [socket, disconnect] = useSocket();

  // 토큰 재발급
  useEffect(() => {
    postWithRefreshToken<UserState | string>('/refreshToken')
      .then(data => {
        if (typeof data === 'object') {
          dispatch(userSlice.actions.setUser(data));
        }
      })
      .catch(err => {
        Alert.alert('알림', err.message);
      });
  }, [dispatch]);

  // socket 활용하기
  useEffect(() => {
    const callback = (data: Order) => {
      //console.log(data);
      dispatch(orderSlice.actions.addOrder(data));
    };
    if (socket && isLoggedIn) {
      socket.emit('acceptOrder', 'hello');
      socket.on('order', callback);
    }

    return () => {
      if (socket) {
        socket.off('order', callback);
      }
    };
  }, [socket, isLoggedIn, dispatch]);

  // disconnect
  useEffect(() => {
    if (!isLoggedIn) {
      disconnect();
    }
  }, [isLoggedIn, disconnect]);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen
            name="Orders"
            component={Orders}
            options={{title: '오더 목록'}}
          />
          <Tab.Screen
            name="Delivery"
            component={Delivery}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{title: '내 정보'}}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{title: '로그인'}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{title: '회원가입'}}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
