import { cva, type VariantProps } from 'class-variance-authority';
import { View, type ViewProps } from 'react-native';

import { cn } from '../../lib/utils';

const cardVariants = cva('rounded-2xl', {
  variants: {
    variant: {
      default: 'bg-white',
      dark: 'bg-zinc-900',
      muted: 'bg-gray-100',
      warning: 'bg-yellow-50 border border-yellow-200',
    },
    padding: {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-5',
    },
  },
  defaultVariants: { variant: 'default', padding: 'md' },
});

interface CardProps extends ViewProps, VariantProps<typeof cardVariants> {}

export function Card({ variant, padding, className, children, ...props }: CardProps) {
  return (
    <View className={cn(cardVariants({ variant, padding }), className)} {...props}>
      {children}
    </View>
  );
}
