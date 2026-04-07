import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { vehicleService } from '../services/vehicle.service';
import type { Vehicle } from '../types/vehicle.types';

const DEBOUNCE_MS = 400;

export function useVehicleSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selected, setSelected] = useState<Vehicle | null>(null);

  // Debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setDebouncedQuery('');
      return;
    }
    const t = setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  // Clear selection when query changes
  useEffect(() => {
    setSelected(null);
  }, [query]);

  // Partial search — fires while typing (debounced)
  const searchQuery = useQuery({
    queryKey: ['vehicles-search', debouncedQuery],
    queryFn: () => vehicleService.search(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    retry: false,
    staleTime: 1000 * 30,
  });

  // Full detail — fires when user selects a result
  const detailQuery = useQuery({
    queryKey: ['vehicle-detail', selected?.licensePlate],
    queryFn: () => vehicleService.getByLicensePlate(selected!.licensePlate),
    enabled: !!selected,
    retry: false,
  });

  const vehicle = detailQuery.data ?? selected;
  const operations = vehicle?.terminalOperations ?? [];

  return {
    query,
    setQuery,
    // Search results list
    results: searchQuery.data ?? [],
    isSearching: searchQuery.isFetching,
    searchError: searchQuery.isError,
    // Selected vehicle detail
    vehicle: detailQuery.data,
    operations,
    isLoadingDetail: detailQuery.isFetching,
    // Select a result to load full detail
    selectVehicle: (v: Vehicle) => setSelected(v),
    clearSelection: () => { setSelected(null); setQuery(''); },
  };
}
