import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';
import React from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;
export default function SignIn({navigation}: Props) {
  const onSignUp = () => {
    navigation.navigate('SignUp');
  };
  const onSubmit = () => {};
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            placeholder="Email"
            autoComplete="email"
            importantForAutofill="yes"
            inputMode="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            blurOnSubmit={false}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            placeholder="Password"
            importantForAutofill="yes"
            autoComplete="password"
            style={styles.input}
            textContentType="password"
            secureTextEntry={true}
            onSubmitEditing={onSubmit}
          />
        </View>
      </View>
      <View>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>로그인</Text>
        </Pressable>
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
  input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBlockColor: 'black',
    borderStyle: 'solid',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
    fontSize: 18,
  },
  inputContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'black',
    marginBottom: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
  buttonEnable: {
    backgroundColor: 'rgb(117, 162, 235)',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 8,
  },
});
