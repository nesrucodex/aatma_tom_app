import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import ScreeenHeader from '../../components/shared/ScreeenHeader';
import { OperatorDetail } from '../../components/features/operators/OperatorDetail';
import { OperatorRow } from '../../components/features/operators/OperatorRow';

const OPERATORS = [
  { id: '1', initials: 'AK', name: 'Abebe K.',   station: 'Bole',      revenue: '3,200 ETB', checkedIn: 'AA-1234', time: '10:30 AM', avatarColor: 'blue'   as const },
  { id: '2', initials: 'SM', name: 'Sara M.',     station: 'Mexico',    revenue: '2,800 ETB', checkedIn: 'AA-1234', time: '10:30 AM', avatarColor: 'purple' as const },
  { id: '3', initials: 'DT', name: 'Daniel T.',   station: 'Kazanchis', revenue: '2,700 ETB', checkedIn: 'AA-1234', time: '10:30 AM', issueCount: 1, avatarColor: 'green'  as const },
  { id: '4', initials: 'FA', name: 'Fatima A.',   station: 'Mexico',    revenue: '4,100 ETB', checkedIn: 'AA-1234', time: '10:30 AM', avatarColor: 'orange' as const },
  { id: '5', initials: 'YB', name: 'Yonas B.',    station: 'Megenagna', revenue: '1,500 ETB', checkedIn: 'AA-1234', time: '10:30 AM', avatarColor: 'yellow' as const },
];

export default function OperatorsScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = OPERATORS.find((o) => o.id === selectedId);

  if (selected) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <ScreeenHeader
          onBack={() => setSelectedId(null)}
          backLabel="Operators">
          <Text className="text-2xl font-bold text-white">{selected.name}</Text>
          <Text className="mt-1 text-sm text-zinc-400">{selected.station}</Text>
        </ScreeenHeader>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <OperatorDetail
            initials={selected.initials}
            name={selected.name}
            station={selected.station}
            carsHandled={42}
            revenue="3,200 ETB"
            issues={selected.issueCount ?? 0}
            log={[
              { label: 'Checked in ABC-1234 at 10:30 AM' },
              { label: 'Checked out XYZ-8890 at 9:15 AM' },
              { label: 'Override on DEF-5678 at 8:00 AM' },
            ]}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreeenHeader>
        <Text className="text-2xl font-bold text-white">Operators</Text>
        <Text className="mt-1 text-sm text-zinc-400">{OPERATORS.length} operators</Text>
      </ScreeenHeader>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }}>
        {OPERATORS.map((op) => (
          <OperatorRow key={op.id} {...op} onPress={() => setSelectedId(op.id)} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
