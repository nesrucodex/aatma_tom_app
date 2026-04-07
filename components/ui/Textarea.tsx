import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { Text, TextInput, type TextInputProps, View } from 'react-native';

import { cn } from '../../lib/utils';

const textareaVariants = cva('rounded-xl px-4 py-3 border text-base', {
  variants: {
    variant: {
      default: 'bg-gray-100 border-transparent text-gray-900',
      outline: 'bg-white border-gray-300 text-gray-900',
      dark:    'bg-zinc-800 border-transparent text-white',
    },
    error: {
      true:  'border-red-500',
      false: '',
    },
  },
  defaultVariants: { variant: 'default', error: false },
});

type TextareaVariantProps = Omit<VariantProps<typeof textareaVariants>, 'error'>;

export interface TextareaProps extends TextInputProps, TextareaVariantProps {
  label?: string;
  error?: string;
  rows?: number;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<TextInput, TextareaProps>(
  ({ label, error, variant, rows = 4, className, wrapperClassName, ...props }, ref) => {
    const hasError = !!error;
    const lineHeight = 22;
    const minHeight = rows * lineHeight + 24; // padding compensation

    return (
      <View className={cn('gap-1', wrapperClassName)}>
        {label ? <Text className="text-sm font-medium text-gray-700">{label}</Text> : null}

        <TextInput
          ref={ref}
          multiline
          textAlignVertical="top"
          placeholderTextColor={variant === 'dark' ? '#71717a' : '#9ca3af'}
          style={{ minHeight }}
          className={cn(textareaVariants({ variant, error: hasError }), className)}
          {...props}
        />

        {error ? <Text className="text-xs text-red-500">{error}</Text> : null}
      </View>
    );
  }
);

Textarea.displayName = 'Textarea';
