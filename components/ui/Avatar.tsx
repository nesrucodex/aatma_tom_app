import { cva, type VariantProps } from 'class-variance-authority';
import stringToColor from 'string-to-color';
import { Text, View } from 'react-native';

import { cn } from '../../lib/utils';

const avatarSizeVariants = cva('items-center justify-center rounded-full', {
  variants: {
    size: {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
    },
  },
  defaultVariants: { size: 'md' },
});

const avatarTextVariants = cva('font-bold text-white', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-xl',
    },
  },
  defaultVariants: { size: 'md' },
});

// Darken a hex color slightly so text stays readable
function darken(hex: string, amount = 0.15): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * amount));
  const b = Math.max(0, (num & 0xff) - Math.round(255 * amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

type AvatarSize = NonNullable<VariantProps<typeof avatarSizeVariants>['size']>;

interface AvatarProps {
  initials: string;
  size?: AvatarSize;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

export function Avatar({ initials, size = 'md', bgColor, textColor, className }: AvatarProps) {
  const bg = bgColor ?? darken(stringToColor(initials), 0.05);

  return (
    <View
      className={cn(avatarSizeVariants({ size }), className)}
      style={{ backgroundColor: bg }}>
      <Text className={cn(avatarTextVariants({ size }))} style={textColor ? { color: textColor } : undefined}>
        {initials}
      </Text>
    </View>
  );
}
