// Define the type for a wash history item
export interface WashHistoryItem {
  location: string;
  date: string;
  time: string;
  label: string;
}

// Example mock data for WashHistory
const mockWashHistory: WashHistoryItem[] = [
  {
    location: "Wash World Søborg",
    date: "I går",
    time: "18:42",
    label: "Brilliant",
  },
  {
    location: "Wash World Søborg",
    date: "27 april 2026",
    time: "10:22",
    label: "Brilliant",
  },
  {
    location: "Wash World Søborg",
    date: "29 april 2026",
    time: "16:29",
    label: "Brilliant",
  },
  {
    location: "Wash World Søborg",
    date: "15 april 2026",
    time: "18:42",
    label: "Brilliant",
  },
  {
    location: "Wash World Søborg",
    date: "7 april 2026",
    time: "10:22",
    label: "Brilliant",
  },
  {
    location: "Wash World Søborg",
    date: "2 april 2026",
    time: "16:29",
    label: "Brilliant",
  },
];

export default mockWashHistory;
