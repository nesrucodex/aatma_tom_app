import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, type TouchableOpacityProps, View } from 'react-native';

import { cn } from '../../lib/utils';
import { ClassValue } from 'clsx';

// Variants

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-full',
  {
    variants: {
      variant: {
        default: 'bg-primary active:bg-primary-800',
        secondary: 'bg-secondary-100 active:bg-secondary-200',
        outline: 'border border-primary bg-transparent active:bg-primary-50',
        ghost: 'bg-transparent active:bg-secondary-100',
        destructive: 'bg-destructive active:bg-destructive-700',
      },
      size: {
        sm: 'h-12 px-4 gap-1',
        md: 'h-14 px-6 gap-2',
        lg: 'h-16 px-8 gap-2',
        xl: 'h-[72px] px-8 gap-2',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'lg' },
  }
);

const buttonTextVariants = cva(
  'font-bold text-center',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        secondary: 'text-secondary-800',
        outline: 'text-primary',
        ghost: 'text-secondary-700',
        destructive: 'text-destructive-foreground',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-base',
        xl: 'text-lg',
        icon: 'text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'lg' },
  }
);

// Type

export interface ButtonProps
  extends TouchableOpacityProps,
  VariantProps<typeof buttonVariants> {
  label: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  classNames?: {
    root?: ClassValue,
    text?: ClassValue,
    activityIndicator?: ClassValue
  }
}

// Component
export const Button = forwardRef<View, ButtonProps>(
  ({ label, variant, size, loading, leftIcon, rightIcon, className, classNames, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <TouchableOpacity
        ref={ref}
        disabled={isDisabled}
        activeOpacity={0.85}
        className={cn(buttonVariants({ variant, size }), isDisabled && 'opacity-50', className, classNames?.root)}
        {...props}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'default' || variant === 'destructive' ? 'white' : 'white'}
            className=''
          />
        ) : (
          <>
            {leftIcon}
            <Text className={cn(buttonTextVariants({ variant, size }), classNames?.text)}>{label}</Text>
            {rightIcon}
          </>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';
