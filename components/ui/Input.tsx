import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { Text, TextInput, type TextInputProps, View } from 'react-native';

import { cn } from '../../lib/utils';

const inputWrapperVariants = cva('flex-row items-center rounded-xl px-4 border', {
  variants: {
    variant: {
      default: 'bg-gray-100 border-transparent',
      outline: 'bg-white border-gray-300',
      dark:    'bg-zinc-800 border-transparent',
    },
    size: {
      sm: 'py-2',
      md: 'py-3',
      lg: 'py-4',
    },
    error: {
      true:  'border-red-500',
      false: '',
    },
    focused: {
      true:  'border-blue-600',
      false: '',
    },
  },
  defaultVariants: { variant: 'default', size: 'md', error: false, focused: false },
});

const inputTextVariants = cva('flex-1 text-base', {
  variants: {
    variant: {
      default: 'text-gray-900',
      outline: 'text-gray-900',
      dark:    'text-white',
    },
  },
  defaultVariants: { variant: 'default' },
});

type InputVariantProps = Omit<VariantProps<typeof inputWrapperVariants>, 'error' | 'focused'>;

export interface InputProps extends TextInputProps, InputVariantProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      variant,
      size,
      leftIcon,
      rightIcon,
      className,
      wrapperClassName,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <View className={cn('gap-1', wrapperClassName)}>
        {label ? <Text className="text-sm font-medium text-gray-700">{label}</Text> : null}

        <View className={cn(inputWrapperVariants({ variant, size, error: hasError }), className)}>
          {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
          <TextInput
            ref={ref}
            className={cn(inputTextVariants({ variant }))}
            placeholderTextColor={variant === 'dark' ? '#71717a' : '#9ca3af'}
            onFocus={onFocus}
            onBlur={onBlur}
            {...props}
          />
          {rightIcon ? <View className="ml-2">{rightIcon}</View> : null}
        </View>

        {error ? <Text className="text-xs text-red-500">{error}</Text> : null}
      </View>
    );
  }
);

Input.displayName = 'Input';
