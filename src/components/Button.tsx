import React, {ReactNode} from 'react';
import {ActivityIndicator, Pressable, PressableProps} from 'react-native';

interface Props extends PressableProps {
  loading: boolean;
  children: ReactNode;
}
export default function Button({loading, children, ...props}: Props) {
  return (
    <Pressable {...props}>
      {loading && <ActivityIndicator />}
      {!loading && children}
    </Pressable>
  );
}
