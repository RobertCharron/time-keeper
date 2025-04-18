export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Station {
  id: string;
  name: string;
  description: string;
  activities: Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  stationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityUse {
  id: string;
  startTime: string;
  endTime: string;
  activityId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  activity: Activity;
  createdAt: string;
  updatedAt: string;
} 