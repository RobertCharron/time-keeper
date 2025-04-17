import { Station } from '../../types';

interface StationStatsProps {
  station: Station & {
    averageActivityTime: number;
    totalUses: number;
  };
}

export function StationStats({ station }: StationStatsProps) {
  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">{station.name}</h3>
      <div className="mt-2 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total Activities:</span>
          <span className="font-medium">{station.activities.length}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total Uses:</span>
          <span className="font-medium">{station.totalUses}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Average Time:</span>
          <span className="font-medium">
            {station.totalUses > 0 ? formatTime(station.averageActivityTime) : 'No data'}
          </span>
        </div>
      </div>
    </div>
  );
} 