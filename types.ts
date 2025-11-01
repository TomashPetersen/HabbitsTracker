
export interface Habit {
  id: string;
  title: string;
  days: { [day: number]: boolean };
  color: string;
}

export interface MonthData {
  habits: Habit[];
}

export interface YearData {
  [monthKey: string]: MonthData; // e.g., "2024-0" for January 2024
}

export interface AppState {
  version: string;
  years: {
    [year: number]: YearData;
  };
}
   