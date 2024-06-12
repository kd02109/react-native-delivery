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
import {instance, postWithRefreshToken} from '@/api';
import {Alert} from 'react-native';
import {UserState, userSlice} from '@/slice/user';
import useSocket from '@/hook/useSocket';
import {orderSlice} from '@/slice/order';
import {Order} from '@/type';
import usePermissions from '@/hook/usePermissions';
import SplashScreen from 'react-native-splash-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import messaging from '@react-native-firebase/messaging';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: {screen?: string};
  Complete: {orderId: string};
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator<LoggedInParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
export default function AppNavigator() {
  const isLoggedIn = useAppSelector(state => !!state.user.email);
  const dispatch = useAppDispatch();
  const [socket, disconnect] = useSocket();
  usePermissions();

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
      })
      .finally(() => {
        SplashScreen.hide();
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

  // FCM 토큰 가지고 오기

  // 토큰 설정
  useEffect(() => {
    async function getToken() {
      // remote message를 위해 기기를 등록합니다.
      try {
        if (!messaging().isDeviceRegisteredForRemoteMessages) {
          await messaging().registerDeviceForRemoteMessages();
        }
        // 이후 토큰을 받아온후 리덕스에 저장합니다.
        const token = await messaging().getToken();
        console.log('phone token', token);
        dispatch(userSlice.actions.setPhoneToken(token));
        // 서버에 전송합니다.
        return instance.post('/phonetoken', {token});
      } catch (error) {
        console.error(error);
      }
    }

    getToken();
  }, [dispatch]);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen
            name="Orders"
            component={Orders}
            options={{
              title: '오더 목록',
              tabBarIcon: () => <Icon name="list" size={20} />,
            }}
          />
          <Tab.Screen
            name="Delivery"
            component={Delivery}
            options={{
              headerShown: false,
              tabBarIcon: () => <Icon name="map" size={20} />,
            }}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{
              title: '내 정보',
              tabBarIcon: () => <Icon name="key" size={20} />,
              unmountOnBlur: true,
            }}
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
