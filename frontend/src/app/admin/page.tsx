'use client';

import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { User, Station, Activity, ActivityUse } from '../../types';
import { StationStats } from '../../components/admin/StationStats';
import { ActivityStats } from '../../components/admin/ActivityStats';

type StationWithStats = Station & {
  averageActivityTime: number;
  totalUses: number;
};

type ActivityWithStats = Activity & {
  averageTime: number;
  totalUses: number;
};

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stations, setStations] = useState<StationWithStats[]>([]);
  const [activities, setActivities] = useState<ActivityWithStats[]>([]);
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
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Fetch stations with their activity uses
      const stationsResponse = await fetch('http://localhost:3000/stations');
      const stationsData = await stationsResponse.json();

      // Fetch all activity uses
      const activityUsesResponse = await fetch('http://localhost:3000/activity-use');
      const activityUsesData: ActivityUse[] = await activityUsesResponse.json();

      // Calculate statistics
      const stationsWithStats = stationsData.map((station: Station) => {
        const stationActivities = station.activities;
        const stationUses = activityUsesData.filter((use) => 
          stationActivities.some(activity => activity.id === use.activityId)
        );

        const totalTime = stationUses.reduce((sum, use) => {
          const start = new Date(use.startTime);
          const end = new Date(use.endTime);
          return sum + (end.getTime() - start.getTime());
        }, 0);

        return {
          ...station,
          averageActivityTime: stationUses.length > 0 ? totalTime / stationUses.length : 0,
          totalUses: stationUses.length,
        };
      });

      // Calculate activity statistics
      const activitiesWithStats = stationsData.flatMap((station: Station) => 
        station.activities.map(activity => {
          const activityUses = activityUsesData.filter((use) => use.activityId === activity.id);
          const totalTime = activityUses.reduce((sum, use) => {
            const start = new Date(use.startTime);
            const end = new Date(use.endTime);
            return sum + (end.getTime() - start.getTime());
          }, 0);

          return {
            ...activity,
            averageTime: activityUses.length > 0 ? totalTime / activityUses.length : 0,
            totalUses: activityUses.length,
          };
        })
      );

      setStations(stationsWithStats);
      setActivities(activitiesWithStats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-indigo-900 mb-6">Admin Dashboard</h1>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-indigo-800 mb-4">Station Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stations.map((station) => (
                  <a
                    key={station.id}
                    href={`/admin/stations/${station.id}`}
                    className="block"
                  >
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-colors border border-indigo-100">
                      <h3 className="text-lg font-medium text-indigo-900">{station.name}</h3>
                      <p className="text-sm text-indigo-600">Total Uses: {station.totalUses}</p>
                      <p className="text-sm text-indigo-600">
                        Average Time: {Math.round(station.averageActivityTime / 1000 / 60)} minutes
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-indigo-800 mb-4">Activity Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.map((activity) => (
                  <a
                    key={activity.id}
                    href={`/admin/activities/${activity.id}`}
                    className="block"
                  >
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors border border-purple-100">
                      <h3 className="text-lg font-medium text-purple-900">{activity.name}</h3>
                      <p className="text-sm text-purple-600">Total Uses: {activity.totalUses}</p>
                      <p className="text-sm text-purple-600">
                        Average Time: {Math.round(activity.averageTime / 1000 / 60)} minutes
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 