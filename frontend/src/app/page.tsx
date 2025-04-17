'use client';

import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { User, Station, Activity } from '../types';
import { StationSelector } from '../components/StationSelector';
import { ActivitySelector } from '../components/ActivitySelector';
import { ActivityDetails } from '../components/ActivityDetails';
import { ActivityTimer } from '../components/ActivityTimer';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
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
      fetchStations();
    }
  }, [user]);

  const fetchStations = async () => {
    try {
      const response = await fetch('http://localhost:3000/stations');
      const data = await response.json();
      setStations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stations:', error);
      setLoading(false);
    }
  };

  const handleStationChange = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    setSelectedStation(station || null);
    setSelectedActivity(null);
  };

  if (!user) {
    return null; // The middleware will handle the redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
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
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user.name}!</h1>
          
          <div className="space-y-6">
            <StationSelector
              stations={stations}
              selectedStation={selectedStation}
              onStationChange={handleStationChange}
            />

            {selectedStation && (
              <ActivitySelector
                station={selectedStation}
                selectedActivity={selectedActivity}
                onActivityChange={setSelectedActivity}
              />
            )}

            {selectedStation && selectedActivity && (
              <>
                <ActivityDetails
                  station={selectedStation}
                  activity={selectedActivity}
                />
                <ActivityTimer
                  station={selectedStation}
                  activity={selectedActivity}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
