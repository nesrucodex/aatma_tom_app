import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { cn } from '../../lib/utils';

const ET_PHONE_RE = /^[97]\d{8}$/;

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  onSubmit?: () => void;
}

export function PhoneInput({
  value,
  onChange,
  label = 'Phone Number',
  placeholder = '9XXXXXXXX',
  className,
  onSubmit,
}: PhoneInputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const isValid = ET_PHONE_RE.test(value);
  const showError = value.length > 0 && !isValid;

  const handleChange = (v: string) => {
    onChange(v.replace(/\D/g, '').slice(0, 9));
  };

  return (
    <View className={cn('gap-1.5', className)}>
      {label && (
        <Text className="text-sm font-semibold text-neutral-700">{label}</Text>
      )}

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        className={cn(
          'h-16 flex-row items-center rounded-xl border bg-neutral-50 px-4',
          focused ? 'border-primary' : 'border-neutral-200',
          showError && 'border-destructive bg-destructive-50',
        )}>
        {/* Flag + prefix */}
        <View className="flex-row items-center gap-2 border-r border-neutral-200 pr-3 mr-3">
          <Text className="text-base">🇪🇹</Text>
          <Text className="text-sm font-semibold text-neutral-700">+251</Text>
        </View>

        <TextInput
          ref={inputRef}
          className="flex-1 text-base font-medium text-neutral-900"
          placeholder={placeholder}
          keyboardType="number-pad"
          returnKeyType="done"
          value={value}
          onChangeText={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={onSubmit}
          placeholderTextColor="#d1d5db"
          maxLength={9}
        />

        {value.length > 0 && (
          <Ionicons
            name={isValid ? 'checkmark-circle' : 'close-circle'}
            size={18}
            color={isValid ? '#16a34a' : '#ef4444'}
          />
        )}
      </TouchableOpacity>

      {showError && (
        <Text className="text-xs text-destructive">
          Enter a valid Ethiopian number (e.g. 962875515)
        </Text>
      )}

      {/* {isValid && (
        <Text className="text-xs text-neutral-400">
          Full number:{' '}
          <Text className="font-semibold text-neutral-600">+251{value}</Text>
        </Text>
      )} */}
    </View>
  );
}
