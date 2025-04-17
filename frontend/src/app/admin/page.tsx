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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Station Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stations.map((station) => (
                  <StationStats key={station.id} station={station} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.map((activity) => (
                  <ActivityStats key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 