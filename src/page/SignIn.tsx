import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'AppNavigator';
import React, {useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import {SignInSchema, signInSchema} from '@/schema/schma';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import Input from '@/components/Input';
import {postSignIn} from '@/api';
import {useAppDispatch} from '@/store';
import {userSlice} from '@/slice/user';
import {setStorage} from '@/lib/encryptedStorage';
import {REFRESH_TOKEN} from '@/lib/constant';
import Button from '@/components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;
export default function SignIn({navigation}: Props) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const {control, handleSubmit} = useForm<SignInSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(signInSchema),
    delayError: 300,
  });
  const onSignUp = () => {
    navigation.navigate('SignUp');
  };
  const onSubmit = async (data: SignInSchema) => {
    setLoading(prev => !prev);
    const response = await postSignIn(data);
    if (typeof response === 'string') {
      Alert.alert('로그인에 실패했습니다.', response);
    } else {
      dispatch(
        userSlice.actions.setUser({
          ...response,
          name: response.name,
          email: response.email,
          accessToken: response.accessToken,
        }),
      );
      await setStorage(REFRESH_TOKEN, response.refreshToken); // 유효기간 1일 30일 accessToken 보다는 길다.
      Alert.alert('로그인.');
    }
    setLoading(prev => !prev);
  };

  return (
    <View style={styles.container}>
      <View>
        <Controller
          control={control}
          name="email"
          render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
            <Input
              title="이메일"
              placeholder="Email"
              autoComplete="email"
              importantForAutofill="yes"
              inputMode="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              blurOnSubmit={false}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={error}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({field: {onChange, value, onBlur}, fieldState: {error}}) => (
            <Input
              title="비밀번호"
              placeholder="Password"
              importantForAutofill="yes"
              autoComplete="password"
              textContentType="password"
              secureTextEntry={true}
              onSubmitEditing={() => handleSubmit(onSubmit)}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={error}
            />
          )}
        />
      </View>
      <View>
        <Button
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
          android_ripple={{color: '#2821de'}}
          loading={loading}>
          <Text style={styles.buttonText}>로그인</Text>
        </Button>
        <Pressable style={styles.button} onPress={onSignUp}>
          <Text style={styles.buttonText}>회원가입</Text>
        </Pressable>
      </View>
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
