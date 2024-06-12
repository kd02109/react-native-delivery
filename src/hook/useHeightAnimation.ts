import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  SharedValue,
} from 'react-native-reanimated';

interface AnimatedStyles {
  height: number;
  overflow: 'hidden';
}

export default function useHeightAnimation(
  duration: number,
): [SharedValue<number>, AnimatedStyles] {
  // animation
  const height = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: withTiming(height.value, {
        duration: duration, // 애니메이션의 지속 시간
      }),
      overflow: 'hidden',
    };
  });

  return [height, animatedStyles];
}
