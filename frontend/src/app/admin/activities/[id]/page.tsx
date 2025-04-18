'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { User, Activity, ActivityUse } from '../../../types';

export default function ActivityDetailsPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
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
      fetchActivityData();
    }
  }, [user, id]);

  const fetchActivityData = async () => {
    try {
      // Fetch activity details
      const activityResponse = await fetch(`http://localhost:3000/activities/${id}`);
      const activityData = await activityResponse.json();
      setActivity(activityData);

      // Fetch activity uses
      const activityUsesResponse = await fetch('http://localhost:3000/activity-use');
      const activityUsesData = await activityUsesResponse.json();
      
      // Filter activity uses for this activity
      const filteredActivityUses = activityUsesData.filter((use: ActivityUse) => 
        use.activityId === id
      );
      
      setActivityUses(filteredActivityUses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activity data:', error);
      setLoading(false);
    }
  };

  const getActivityStats = () => {
    const totalUses = activityUses.length;
    const totalTime = activityUses.reduce((sum, use) => {
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

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900">Activity not found</h1>
          </div>
        </div>
      </div>
    );
  }

  const { totalUses, averageTime } = getActivityStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-indigo-900">{activity.name}</h1>
            <a
              href="/admin"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ← Back to Admin Dashboard
            </a>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-100">
              <h2 className="text-xl font-semibold text-purple-900 mb-4">Activity Details</h2>
              <p className="text-purple-700 mb-4">{activity.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-purple-100">
                  <p className="text-sm font-medium text-purple-600">Total Uses</p>
                  <p className="text-2xl font-bold text-purple-900">{totalUses}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-purple-100">
                  <p className="text-sm font-medium text-purple-600">Average Time</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {Math.round(averageTime / 1000 / 60)} minutes
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-indigo-800 mb-4">Usage History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-indigo-200">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                        Start Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                        End Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-indigo-200">
                    {activityUses.map((use) => {
                      const startTime = new Date(use.startTime);
                      const endTime = new Date(use.endTime);
                      const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60);
                      
                      return (
                        <tr key={use.id} className="hover:bg-indigo-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">
                            {use.user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">
                            {startTime.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">
                            {endTime.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">
                            {duration} minutes
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 