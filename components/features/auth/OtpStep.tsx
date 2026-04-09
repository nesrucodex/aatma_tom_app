import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Button } from '../../../components/ui/Button';
import { StatusBar } from 'expo-status-bar';

const OTP_LENGTH = 6;

type Props = {
  countdown: number;
  onComplete: (otp: string) => void;
  onResend?: () => void;
  loading?: boolean;
};

export function OtpStep({ countdown, onComplete, onResend, loading }: Props) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const refs = useRef<(TextInput | null)[]>([]);

  const updateOtp = (digits: string[]) => {
    setOtp(digits);
  };

  const handleChange = (value: string, index: number) => {
    // Handle paste — value may contain multiple digits
    const digits = value.replace(/\D/g, '').slice(0, OTP_LENGTH - index);

    if (digits.length > 1) {
      // Distribute pasted digits across inputs starting at current index
      const updated = [...otp];
      for (let i = 0; i < digits.length; i++) {
        if (index + i < OTP_LENGTH) updated[index + i] = digits[i];
      }
      updateOtp(updated);
      // Focus the input after the last filled one
      const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
      refs.current[nextIndex]?.focus();
      return;
    }

    // Single character
    const updated = [...otp];
    updated[index] = digits;
    updateOtp(updated);
    if (digits && index < OTP_LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleSignIn = () => {
    const code = otp.join('');
    if (code.length === OTP_LENGTH) onComplete(code);
  };

  useEffect(() => {
    if (otp.length === OTP_LENGTH) {
      handleSignIn()
    }
  }, [otp])

  return (
    <View className="gap-4">
      <StatusBar hidden />
      <View>
        <Text className="mb-3 text-sm font-medium text-gray-700">OTP</Text>
        <View className="flex-row justify-between gap-2">
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              className="h-16 flex-1 rounded-xl bg-gray-100 text-center text-base font-semibold text-gray-900"
              maxLength={OTP_LENGTH}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(v) => handleChange(v, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
            />
          ))}
        </View>
      </View>

      <View className='flex flex-row items-end gap-0' >
        <Text className="text-xs text-gray-500">
          You can resend the code in {countdown} seconds.{' '}
        </Text>
        <TouchableOpacity onPress={onResend}>
          <Text className="font-semibold text-gray-700 underline">Resend OTP</Text>
        </TouchableOpacity>
      </View>

      <Button
        label="Sign In"
        className="mt-2 w-full"
        loading={loading}
        onPress={handleSignIn}
        rightIcon={!loading ? <Ionicons name="arrow-forward" size={18} color="white" /> : undefined}
      />

      <Text className="mt-4 text-center text-xs text-gray-400">
        Terminal Operations System v1.0
      </Text>
    </View>
  );
}
