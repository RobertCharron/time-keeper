import { Station } from '../types';

interface StationSelectorProps {
  stations: Station[];
  selectedStation: Station | null;
  onStationChange: (stationId: string) => void;
}

export function StationSelector({ stations, selectedStation, onStationChange }: StationSelectorProps) {
  return (
    <div>
      <label htmlFor="station" className="block text-sm font-medium text-gray-700">
        Select Station
      </label>
      <select
        id="station"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        value={selectedStation?.id || ''}
        onChange={(e) => onStationChange(e.target.value)}
      >
        <option value="">Select a station</option>
        {stations.map((station) => (
          <option key={station.id} value={station.id}>
            {station.name}
          </option>
        ))}
      </select>
    </div>
  );
} 