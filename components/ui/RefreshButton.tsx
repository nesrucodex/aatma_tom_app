import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface RefreshButtonProps {
  onRefresh: () => void;
  isFetching?: boolean;
  size?: number;
  color?: string;
  style?: object;
}

export function RefreshButton({
  onRefresh,
  isFetching = false,
  size = 20,
  color = '#9ca3af',
  style,
}: RefreshButtonProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isFetching) {
      rotation.value = 0;
      rotation.value = withRepeat(
        withTiming(360, { duration: 700, easing: Easing.linear }),
        -1, // infinite
        false,
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = withTiming(0, { duration: 150 });
    }
  }, [isFetching]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <TouchableOpacity
      onPress={onRefresh}
      activeOpacity={0.7}
      disabled={isFetching}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={style}
      className='bg-[rgb(255_255_255_/_0.025)] size-[2.25rem] flex justify-center items-center rounded-xl'
    >
      <Animated.View style={animatedStyle}>
        <Ionicons name="refresh-sharp" size={size} color={color} />
      </Animated.View>
    </TouchableOpacity>
  );
}
