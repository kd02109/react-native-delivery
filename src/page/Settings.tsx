import {getWithAuthToken, postWithAuthToken} from '@/api';
import {REFRESH_TOKEN} from '@/lib/constant';
import {deleteStorage} from '@/lib/encryptedStorage';
import {userSlice} from '@/slice/user';
import {useAppDispatch, useAppSelector} from '@/store';
import React, {useEffect} from 'react';
import {Text, View, Pressable, Alert, StyleSheet} from 'react-native';

export default function Settings() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const onLogout = async () => {
    try {
      await postWithAuthToken('/logout', user.accessToken);
      Alert.alert('알림', '로그아웃 되었습니다.');
      dispatch(
        userSlice.actions.setUser({
          name: '',
          email: '',
          refreshToken: '',
          accessToken: '',
          money: 0,
        }),
      );
      await deleteStorage(REFRESH_TOKEN);
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('알림', err.message);
      }
    }
  };

  useEffect(() => {
    getWithAuthToken<number>('/showmethemoney', user.accessToken).then(data =>
      dispatch(userSlice.actions.setMoney(data.data)),
    );
  }, [dispatch, user.accessToken]);

  return (
    <View style={styles.container}>
      <View style={styles.moneyView}>
        <Text style={styles.moneyText}>{user.name}님의 수익금</Text>
        <Text style={StyleSheet.compose(styles.moneyText, styles.money)}>
          {user.money.toLocaleString('en-US')}원
        </Text>
      </View>
      <Pressable style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>로그아웃</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  moneyView: {
    flexDirection: 'row',
    gap: 4,
  },
  moneyText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  money: {
    color: 'blue',
  },
  button: {
    backgroundColor: 'rgb(117, 162, 235)',
    marginBottom: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
});
