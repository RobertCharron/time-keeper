import { Activity, Station } from '../types';

interface ActivityDetailsProps {
  station: Station;
  activity: Activity;
}

export function ActivityDetails({ station, activity }: ActivityDetailsProps) {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900">Selected Activity</h3>
      <div className="mt-2">
        <p className="text-sm text-gray-600">
          Station: {station.name}
        </p>
        <p className="text-sm text-gray-600">
          Activity: {activity.name}
        </p>
      </div>
    </div>
  );
} 