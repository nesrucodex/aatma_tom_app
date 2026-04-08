import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../../assets';
import { OtpStep } from '../../components/features/auth/OtpStep';
import { PhoneStep } from '../../components/features/auth/PhoneStep';
import { useRequestOtp, useVerifyOtp } from '../../hooks/useAuth';
import { parseApiError } from '../../lib/api-error';
import { toast } from '../../lib/toast';
import { Link } from 'expo-router';
import { env } from '@/config/env.config';

export default function SignInScreen() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [countdown] = useState(24);

  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();

  useEffect(() => {
    if (requestOtp.isSuccess) {
      setStep('otp');
      toast.success('OTP sent successfully');
    }
  }, [requestOtp.isSuccess]);

  useEffect(() => {
    if (requestOtp.isError) toast.error(parseApiError(requestOtp.error));
  }, [requestOtp.isError]);

  useEffect(() => {
    if (verifyOtp.isError) toast.error(parseApiError(verifyOtp.error));
  }, [verifyOtp.isError]);

  const handleNext = (validPhone: string) => {
    setPhone(validPhone);
    requestOtp.mutate(`+251${validPhone}`);
  };

  const handleSignIn = (code: string) => {
    verifyOtp.mutate({ phoneNumber: `+251${phone}`, otp: code });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="relative">
          <Image source={images.authCover} className="h-60 w-full" resizeMode="cover" />
          {/* White → transparent gradient over the top of the image */}
          <LinearGradient
            colors={['white', 'transparent']}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 72 }}
            className='opacity-50'
          />
          {step === 'otp' && (
            <TouchableOpacity
              onPress={() => setStep('phone')}
              className="absolute left-4 top-4 flex-row items-center gap-1 rounded-full bg-black/40 px-3 py-2">
              <Ionicons name="chevron-back" size={16} color="white" />
              <Text className="text-sm font-medium text-white">Back</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="items-center" style={{ marginTop: -28 }}>
          <View className="h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-blue-700">
            <Ionicons name="log-in-outline" size={34} color="white" />
          </View>
        </View>

        <View className="flex-1 px-6 pt-6">
          <Text className="mb-6 text-center text-2xl font-bold text-gray-900">
            Terminal Staff Manager
          </Text>

          {step === 'phone' ? (
            <PhoneStep
              phone={phone}
              setPhone={setPhone}
              onNext={handleNext}
              loading={requestOtp.isPending}
            />
          ) : (
            <OtpStep
              countdown={countdown}
              onComplete={handleSignIn}
              loading={verifyOtp.isPending}
            />
          )}
        </View>
        <Text>EXPO_PUBLIC_API_URL: {env.EXPO_PUBLIC_API_URL}</Text>
        <Text>EXPO_PUBLIC_APP_ENV: {env.EXPO_PUBLIC_APP_ENV}</Text>
        {/* <Link href={"/(tabs)"} className='text-white bg-primary w-20 text-center rounded-full py-2'>SKIP</Link> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
