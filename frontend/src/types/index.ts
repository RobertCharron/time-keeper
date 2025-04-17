export type User = {
  id: string;
  email: string;
  name: string;
};

export type Station = {
  id: string;
  name: string;
  activities: Activity[];
};

export type Activity = {
  id: string;
  name: string;
}; 