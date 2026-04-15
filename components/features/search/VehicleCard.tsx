import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Alert } from '../../ui/Alert';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Collapsible } from '../../ui/Collapsible';
import { Timeline } from '../../ui/Timeline';
import type { Vehicle, VehicleOperation } from '../../../types/vehicle.types';
import { useVehicleDrivedData } from '@/hooks/useVehicleDrivedData';
import { useCheckIn } from '@/hooks/useCheckIn';
import { useEffect } from 'react';
import { toast } from '@/lib/toast';

export interface VehicleCardProps {
    vehicle: Vehicle;
    operations?: VehicleOperation[];
    loading?: boolean;
    onAction: (vehicleId: string) => void;
    onViewDetail: (vehicleId: string) => void;
}

const STATUS_BADGE = {
    'checked-out': { variant: 'success' as const, label: 'Checked Out' },
    'checked-in': { variant: 'default' as const, label: 'Checked In' },
};

function Skeleton({ className }: { className?: string }) {
    return <View className={`rounded-lg bg-neutral-100 ${className ?? ''}`} />;
}

export function VehicleCard({
    vehicle,
    operations = [],
    loading = false,
    onAction,
    onViewDetail,
}: VehicleCardProps) {
    const {
        isEmptyOperation,
        isCheckedOut,
        statusKey,
        station,
        operator,
        duration,
        routeName,
        canAct,
        canResolveAndCheckIn,
        timeline,
    } = useVehicleDrivedData(
        vehicle,
        operations,
    );

    const checkInMutation = useCheckIn()


    const checkIn = () => {
        checkInMutation.mutate(vehicle.id)
    }

    const cfg = STATUS_BADGE[statusKey];

    useEffect(() => {
        if (checkInMutation.isSuccess) {
            toast.success("Vehicle checked-in successfully.")

        } else if (checkInMutation.isError) {
            const errMsg = checkInMutation.error.message || "Error occured while checking in a vehicle."
            toast.error(errMsg)
        }
    }, [checkInMutation.isSuccess, checkInMutation.isError, checkInMutation.error])

    return (
        <View className="rounded-xl border border-neutral-200/80 p-4 gap-4 mb-4">

            {/* Plate + badge */}
            <View className="flex-row items-center justify-between">
                {loading ? <Skeleton className="h-8 w-36" /> : (
                    <Text className="text-3xl font-black text-neutral-900">{vehicle.licensePlate}</Text>
                )}
                {loading ? <Skeleton className="h-6 w-24" /> : (
                    !isEmptyOperation && <Badge label={cfg.label} variant={cfg.variant} />
                )}
            </View>

            {/* Info row */}
            {loading ? (
                <View className="flex-row gap-6">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-16" />
                </View>
            ) : (
                <View className="flex-row gap-6 flex-wrap">
                    {[
                        { label: 'Station', value: station },
                        { label: 'Operator', value: operator },
                        { label: 'Time', value: duration },
                    ].map((item) => (
                        <View key={item.label}>
                            <Text className="text-xs text-neutral-400">{item.label}</Text>
                            <Text className="text-sm font-bold text-neutral-900">{item.value}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Route */}
            {!loading && (
                <View className="gap-0.5">
                    <Text className="text-xs text-neutral-400">Route</Text>
                    <Text className={`text-sm font-bold ${routeName ? 'text-neutral-900' : 'text-neutral-400'}`}>
                        {routeName ?? 'No route assigned'}
                    </Text>
                </View>
            )}

            <View className="h-px bg-neutral-100" />

            {/* Timeline */}
            {loading ? (
                <View className="gap-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-40" />
                </View>
            ) : (
                <Collapsible icon="receipt-outline" title="Activity Timeline" badge={timeline.length} defaultOpen>
                    <Timeline
                        items={timeline.map((item) => ({
                            label: item.label,
                            sublabel: `${item.time} · ${item.station}`,
                        }))}
                    />
                </Collapsible>
            )}

            {/* Actions */}
            <View className="gap-2.5 mt-1">
                {canAct && (isCheckedOut || isEmptyOperation) && (
                    <Button
                        label="Check-in"
                        variant="default"
                        size="lg"
                        disabled={checkInMutation.isPending}
                        loading={checkInMutation.isPending}
                        className="w-full"
                        leftIcon={<Ionicons name="checkmark-circle-outline" size={20} color="white" />}
                        onPress={checkIn}
                    />
                )}
                {canAct && canResolveAndCheckIn && (
                    <Button
                        label="Resolve & Check-in"
                        variant="default"
                        size="lg"
                        disabled={loading}
                        className="w-full"
                        leftIcon={<Ionicons name="flash" size={20} color="white" />}
                        onPress={() => onAction(vehicle.id)}
                    />
                )}
                {!canAct && (
                    <Alert
                        variant="info"
                        title="Not on your route"
                        description="This vehicle's route does not pass through your terminal."
                    />
                )}
                <Button
                    label="View Details"
                    variant="outline"
                    size="md"
                    disabled={loading}
                    className="w-full"
                    leftIcon={<Ionicons name="document-text-outline" size={16} color="#1d4ed8" />}
                    onPress={() => onViewDetail(vehicle.id)}
                />
            </View>
        </View>
    );
}
