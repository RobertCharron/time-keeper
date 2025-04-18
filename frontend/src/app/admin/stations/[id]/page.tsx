'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { User, Station, Activity, ActivityUse } from '../../../types';

export default function StationActivitiesPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [station, setStation] = useState<Station | null>(null);
  const [activityUses, setActivityUses] = useState<ActivityUse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userCookie = getCookie('user');
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie as string));
      } catch (error) {
        console.error('Error parsing user cookie:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchStationData();
    }
  }, [user, id]);

  const fetchStationData = async () => {
    try {
      // Fetch station details
      const stationResponse = await fetch(`http://localhost:3000/stations/${id}`);
      const stationData = await stationResponse.json();
      setStation(stationData);

      // Fetch activity uses for this station
      const activityUsesResponse = await fetch('http://localhost:3000/activity-use');
      const activityUsesData = await activityUsesResponse.json();
      
      // Filter activity uses for this station's activities
      const stationActivityIds = stationData.activities.map((activity: Activity) => activity.id);
      const filteredActivityUses = activityUsesData.filter((use: ActivityUse) => 
        stationActivityIds.includes(use.activityId)
      );
      
      setActivityUses(filteredActivityUses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching station data:', error);
      setLoading(false);
    }
  };

  const getActivityStats = (activityId: string) => {
    const activityUsesForActivity = activityUses.filter(use => use.activityId === activityId);
    const totalUses = activityUsesForActivity.length;
    const totalTime = activityUsesForActivity.reduce((sum, use) => {
      const start = new Date(use.startTime);
      const end = new Date(use.endTime);
      return sum + (end.getTime() - start.getTime());
    }, 0);
    const averageTime = totalUses > 0 ? totalTime / totalUses : 0;

    return {
      totalUses,
      averageTime
    };
  };

  if (!user) {
    return null; // The middleware will handle the redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900">Station not found</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-indigo-900">{station.name}</h1>
            <a
              href="/admin"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ← Back to Admin Dashboard
            </a>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-indigo-800 mb-4">Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {station.activities.map((activity) => {
                  const { totalUses, averageTime } = getActivityStats(activity.id);

                  return (
                    <a
                      key={activity.id}
                      href={`/admin/activities/${activity.id}`}
                      className="block"
                    >
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors border border-purple-100">
                        <h3 className="text-lg font-medium text-purple-900">{activity.name}</h3>
                        <p className="text-sm text-purple-600">{activity.description}</p>
                        <div className="mt-2">
                          <p className="text-sm text-purple-600">Total Uses: {totalUses}</p>
                          <p className="text-sm text-purple-600">
                            Average Time: {Math.round(averageTime / 1000 / 60)} minutes
                          </p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 