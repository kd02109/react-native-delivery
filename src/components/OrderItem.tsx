import {postWithAuthToken} from '@/api';
import Button from '@/components/Button';
import useHeightAnimation from '@/hook/useHeightAnimation';
import {REFRESH_TOKEN} from '@/lib/constant';
import {deleteStorage} from '@/lib/encryptedStorage';
import getDistanceFromLatLonInKm from '@/lib/getDistanceFromLatLonInKm';
import {orderSlice} from '@/slice/order';
import {userSlice} from '@/slice/user';
import {useAppDispatch, useAppSelector} from '@/store';
import {Order} from '@/type';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from 'AppNavigator';
import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ListRenderItemInfo,
  Alert,
  Dimensions,
} from 'react-native';
import NaverMapView, {Marker, Path} from 'react-native-nmap';
import Animated from 'react-native-reanimated';

export default function OrderItem(props: ListRenderItemInfo<Order>) {
  const {item} = props;
  const start = item.start;
  const end = item.end;
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [height, animatedStyles] = useHeightAnimation(300);
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(state => state.user.accessToken);
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const onToggle = () => {
    setIsOpen(prev => !prev);
    height.value = isOpen ? 0 : 320;
  };

  const onAccept = async () => {
    setLoading(prev => !prev);
    dispatch(orderSlice.actions.acceptOrder(item.orderId));
    try {
      await postWithAuthToken('/accept', accessToken, {
        orderId: item.orderId,
      });
      setLoading(prev => !prev);
      navigation.navigate('Delivery', {screen: 'Ing'});
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('Error', err.message);
        // 리프레시 토큰이 만료되었을 경우
        if (err.message === '로그인 기간이 만료되었습니다.') {
          await deleteStorage(REFRESH_TOKEN);
          dispatch(userSlice.actions.setReset());
        }
      }
      dispatch(orderSlice.actions.rejectOrder(item.orderId));
      setLoading(prev => !prev);
    }
  };

  const onReject = async () => {
    dispatch(orderSlice.actions.rejectOrder(item.orderId));
  };
  return (
    <View style={styles.orderContainer}>
      <Pressable onPress={onToggle}>
        <View style={styles.info}>
          <Text style={styles.eachInfo}>
            {item.price.toLocaleString('en-US')}
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
              <View
                style={{
                  width: Dimensions.get('window').width - 30,
                  height: 200,
                  marginTop: 10,
                }}>
                <NaverMapView
                  style={{width: '100%', height: '100%'}}
                  zoomControl={true}
                  center={{
                    zoom: 10,
                    tilt: 50,
                    latitude: (start.latitude + end.latitude) / 2,
                    longitude: (start.longitude + end.longitude) / 2,
                  }}>
                  <Marker
                    coordinate={{
                      latitude: start.latitude,
                      longitude: start.longitude,
                    }}
                    pinColor="blue"
                  />
                  <Path
                    coordinates={[
                      {
                        latitude: start.latitude,
                        longitude: start.longitude,
                      },
                      {latitude: end.latitude, longitude: end.longitude},
                    ]}
                  />
                  <Marker
                    coordinate={{
                      latitude: end.latitude,
                      longitude: end.longitude,
                    }}
                  />
                </NaverMapView>
              </View>
              <View style={styles.buttonWrapper}>
                <Button
                  onPress={onAccept}
                  style={styles.acceptButton}
                  loading={loading}>
                  <Text style={styles.buttonText}>수락</Text>
                </Button>
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
    marginTop: 10,
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
