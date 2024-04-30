import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'AppNavigator';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SignUpSchema, signUpSchema} from '@/schema/schma';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import Input from '@/components/Input';
import DismissKeyboardView from '@/components/DismisKeyboardView';
import {postSignup} from '@/api';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;
export default function SignUp({navigation}: Props) {
  const [loading, setLoading] = useState(false);
  const {control, handleSubmit} = useForm<SignUpSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(signUpSchema),
    delayError: 300,
  });

  const onSubmit = async (data: SignUpSchema) => {
    console.log(data);
    if (loading) {
      return;
    }

    setLoading(prev => !prev);
    const message = await postSignup(data);
    setLoading(prev => !prev);
    Alert.alert('Check', message);
  };

  return (
    <DismissKeyboardView style={styles.container}>
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
          name="name"
          render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
            <Input
              title="이름"
              placeholder="Name"
              autoComplete="name"
              importantForAutofill="yes"
              inputMode="text"
              textContentType="name"
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
        <Pressable
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          android_ripple={{color: '#2821de'}}>
          {loading ? (
            <ActivityIndicator color={'white'} />
          ) : (
            <Text style={styles.buttonText}>회원가입</Text>
          )}
        </Pressable>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flex: 1,
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
