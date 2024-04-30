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
import {postWithToken} from '@/api';
import {Alert} from 'react-native';
import {UserState, userSlice} from '@/slice/user';
import useSocket from '@/hook/useSocket';

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
    postWithToken<UserState | string>('/refreshToken').then(data => {
      if (typeof data === 'string') {
        Alert.alert('알림', data);
      } else {
        dispatch(userSlice.actions.setUser(data));
      }
    });
  }, [dispatch]);

  // socket 활용하기
  useEffect(() => {
    const callback = (data: any) => {
      console.log(data);
    };
    if (socket && isLoggedIn) {
      socket.emit('login', 'hello');
      socket.on('hello', callback);
    }

    return () => {
      if (socket) {
        socket.off('hello', callback);
      }
    };
  }, [socket, isLoggedIn]);

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
