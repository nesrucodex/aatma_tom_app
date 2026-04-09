import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Button } from '../../ui/Button';
import { cn } from '../../../lib/utils';
import { PhoneInput } from '@/components/ui/PhoneInput';

const ET_PHONE_RE = /^[97]\d{8}$/;

type Props = {
  phone: string;
  setPhone: (v: string) => void;
  onNext: (phone: string) => void;
  loading?: boolean;
};

export function PhoneStep({ phone, setPhone, onNext, loading }: Props) {
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const isValid = ET_PHONE_RE.test(phone);
  const showError = touched && !isValid;

  const handleChange = (value: string) => {
    setPhone(value.replace(/\D/g, '').slice(0, 9));
  };

  const handleNext = () => {
    setTouched(true);
    if (isValid) onNext(phone);
  };

  return (
    <View className="gap-5">
      <PhoneInput
        value={phone}
        onChange={handleChange}
        label='Phone Number'

      />

      <Button
        label="Next"
        onPress={handleNext}
        loading={loading}
        className="w-full mt-6"
        rightIcon={!loading ? <Ionicons name="arrow-forward" size={18} color="white" /> : undefined}
      />

      <Text className="text-center text-xs text-gray-400">
        Terminal Operations System v1.0
      </Text>
    </View>
  );
}
