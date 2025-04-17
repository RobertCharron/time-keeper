import { Activity, Station } from '../types';

interface ActivitySelectorProps {
  station: Station;
  selectedActivity: Activity | null;
  onActivityChange: (activity: Activity | null) => void;
}

export function ActivitySelector({ station, selectedActivity, onActivityChange }: ActivitySelectorProps) {
  return (
    <div>
      <label htmlFor="activity" className="block text-sm font-medium text-gray-700">
        Select Activity
      </label>
      <select
        id="activity"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        value={selectedActivity?.id || ''}
        onChange={(e) => {
          const activity = station.activities.find(a => a.id === e.target.value);
          onActivityChange(activity || null);
        }}
      >
        <option value="">Select an activity</option>
        {station.activities.map((activity) => (
          <option key={activity.id} value={activity.id}>
            {activity.name}
          </option>
        ))}
      </select>
    </div>
  );
} 