import React from 'react';
import {FieldError} from 'react-hook-form';
import {Text, TextInput, TextInputProps, View, StyleSheet} from 'react-native';

type Props = TextInputProps & {
  title: string;
  error?: FieldError;
};

export default function Input({title, error, ...props}: Props) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{title}</Text>
      <TextInput style={styles.input} {...props} />
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
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
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#eb2f5e',
    paddingHorizontal: 8,
    marginTop: 2,
  },
});
