import { Ionicons } from '@expo/vector-icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { Text, View } from 'react-native';

import { cn } from '../../lib/utils';

const alertVariants = cva('rounded-xl border p-3 gap-1', {
  variants: {
    variant: {
      warning:     'bg-warning-50 border-warning-200',
      destructive: 'bg-destructive-50 border-destructive-200',
      success:     'bg-success-50 border-success-200',
      info:        'bg-primary-50 border-primary-200',
    },
  },
  defaultVariants: { variant: 'warning' },
});

const alertTitleVariants = cva('text-sm font-bold', {
  variants: {
    variant: {
      warning:     'text-warning-700',
      destructive: 'text-destructive-700',
      success:     'text-success-700',
      info:        'text-primary-700',
    },
  },
  defaultVariants: { variant: 'warning' },
});

const alertDescVariants = cva('text-xs leading-4', {
  variants: {
    variant: {
      warning:     'text-warning-600',
      destructive: 'text-destructive-600',
      success:     'text-success-600',
      info:        'text-primary-600',
    },
  },
  defaultVariants: { variant: 'warning' },
});

const ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  warning:     'warning',
  destructive: 'close-circle',
  success:     'checkmark-circle',
  info:        'information-circle',
};

const ICON_COLORS: Record<string, string> = {
  warning:     '#d97706',
  destructive: '#dc2626',
  success:     '#16a34a',
  info:        '#2563eb',
};

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;

export interface AlertClassNames {
  root?: string;
  header?: string;
  icon?: string;
  title?: string;
  description?: string;
}

export interface AlertProps extends VariantProps<typeof alertVariants> {
  title: string;
  description?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  className?: string;
  classNames?: AlertClassNames;
  children?: React.ReactNode;
}

export function Alert({
  title,
  description,
  icon,
  variant = 'warning',
  className,
  classNames = {},
  children,
}: AlertProps) {
  const v = (variant ?? 'warning') as AlertVariant;
  const resolvedIcon = icon ?? ICONS[v];
  const iconColor = ICON_COLORS[v];

  return (
    <View className={cn(alertVariants({ variant }), className, classNames.root)}>
      <View className={cn('flex-row items-center gap-2', classNames.header)}>
        <Ionicons name={resolvedIcon} size={14} color={iconColor} />
        <Text className={cn(alertTitleVariants({ variant }), classNames.title)}>
          {title}
        </Text>
      </View>

      {description && (
        <Text className={cn(alertDescVariants({ variant }), classNames.description)}>
          {description}
        </Text>
      )}

      {children}
    </View>
  );
}
