import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, type ReactNode } from 'react';
import { Text, View } from 'react-native';

interface SheetProps {
  snapPoints?: (string | number)[];
  title?: string;
  subtitle?: string;
  children: ReactNode;
  onClose?: () => void;
}

const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
    opacity={0.5}
    pressBehavior="close"
  />
);

export const Sheet = forwardRef<BottomSheet, SheetProps>(
  ({ snapPoints = ['50%'], title, subtitle, children, onClose }, ref) => {
    const handleChange = useCallback(
      (index: number) => {
        if (index === -1) onClose?.();
      },
      [onClose],
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onChange={handleChange}
        handleIndicatorStyle={{ backgroundColor: '#d1d5db', width: 40 }}
        backgroundStyle={{ borderRadius: 24, backgroundColor: '#ffffff' }}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 20,
        }}>
        {(title || subtitle) && (
          <View className="px-5 pb-3 pt-1">
            {title && <Text className="text-lg font-bold text-gray-900">{title}</Text>}
            {subtitle && <Text className="mt-0.5 text-sm text-gray-400">{subtitle}</Text>}
          </View>
        )}
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}>
          {children}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);

Sheet.displayName = 'Sheet';
