import {postWithToken} from '@/api';
import {REFRESH_TOKEN} from '@/lib/constant';
import {deleteStorage} from '@/lib/encryptedStorage';
import {userSlice} from '@/slice/user';
import {useAppDispatch} from '@/store';
import React from 'react';
import {Text, View, Pressable, Alert, StyleSheet} from 'react-native';

export default function Settings() {
  const dispatch = useAppDispatch();
  const onLogout = async () => {
    try {
      await postWithToken('/logout');
      Alert.alert('알림', '로그아웃 되었습니다.');
      dispatch(
        userSlice.actions.setUser({
          name: '',
          email: '',
          refreshToken: '',
          accessToken: '',
        }),
      );
      await deleteStorage(REFRESH_TOKEN);
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('알림', err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
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
