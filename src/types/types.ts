export type Tracker = {
  id: string;
  trackerName: string;
  trackerId: string;
  updatedAt: string;
  createdAt: string;
  state: {
    battery: number;
    online: boolean;
  };
};

export type Trackers = {
  [key: string]: Tracker;
};
