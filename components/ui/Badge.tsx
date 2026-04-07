import { cva, type VariantProps } from 'class-variance-authority';
import { Text, View } from 'react-native';

import { cn } from '../../lib/utils';

const badgeVariants = cva('rounded-full px-2 py-0.5 self-start', {
  variants: {
    variant: {
      default: 'bg-primary-100',
      success: 'bg-success-100',
      warning: 'bg-warning-100',
      danger:  'bg-destructive-100',
      muted:   'bg-secondary-100',
    },
  },
  defaultVariants: { variant: 'default' },
});

const badgeTextVariants = cva('text-xs font-semibold', {
  variants: {
    variant: {
      default: 'text-primary-700',
      success: 'text-success-700',
      warning: 'text-warning-700',
      danger:  'text-destructive-700',
      muted:   'text-secondary-500',
    },
  },
  defaultVariants: { variant: 'default' },
});

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  label: string;
  className?: string;
}

export function Badge({ label, variant, className }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)}>
      <Text className={cn(badgeTextVariants({ variant }))}>{label}</Text>
    </View>
  );
}
