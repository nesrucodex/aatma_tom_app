import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Button } from '../../ui/Button';
import { cn } from '../../../lib/utils';

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
      <View className="gap-1.5">
        <Text className="text-base font-semibold text-gray-700">Phone Number</Text>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => inputRef.current?.focus()}
          className={cn(
            'h-16 flex-row items-center rounded-2xl border bg-gray-50 px-4',
            focused ? 'border-blue-600' : 'border-gray-200',
            showError && 'border-red-500 bg-red-50'
          )}>
          <View className="flex-row items-center gap-2 border-r border-gray-200 pr-3 mr-3">
            <Text className="text-base">🇪🇹</Text>
            <Text className="text-base font-semibold text-gray-800">+251</Text>
          </View>

          <TextInput
            ref={inputRef}
            className="flex-1 text-base font-medium text-gray-900"
            placeholder="9XXXXXXXX"
            keyboardType="number-pad"
            value={phone}
            onChangeText={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => { setFocused(false); setTouched(true); }}
            placeholderTextColor="#d1d5db"
            maxLength={9}
          />

          {phone.length > 0 && (
            <Ionicons
              name={isValid ? 'checkmark-circle' : 'close-circle'}
              size={18}
              color={isValid ? '#16a34a' : '#ef4444'}
            />
          )}
        </TouchableOpacity>

        {showError && (
          <Text className="text-xs text-red-500">
            Enter a valid Ethiopian number (e.g. 962875515)
          </Text>
        )}
      </View>

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
