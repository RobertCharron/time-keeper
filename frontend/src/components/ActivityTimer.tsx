import { useState, useEffect } from 'react';
import { Activity, Station } from '../types';

interface ActivityTimerProps {
  station: Station;
  activity: Activity;
}

export function ActivityTimer({ station, activity }: ActivityTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = async () => {
    if (!isRunning) {
      // Start the timer
      setStartTime(new Date());
      setIsRunning(true);
    } else {
      // Stop the timer and save the activity use
      setIsRunning(false);
      const endTime = new Date();
      
      try {
        const response = await fetch('http://localhost:3000/activity-use', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startTime: startTime?.toISOString(),
            endTime: endTime.toISOString(),
            activityId: activity.id,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save activity use');
        }

        // Reset the timer
        setStartTime(null);
        setElapsedTime(0);
      } catch (error) {
        console.error('Error saving activity use:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-mono">{formatTime(elapsedTime)}</div>
        <button
          onClick={handleStartStop}
          className={`px-4 py-2 rounded-md text-white ${
            isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {isRunning ? 'Activity in progress...' : 'Ready to start activity'}
      </div>
    </div>
  );
} 