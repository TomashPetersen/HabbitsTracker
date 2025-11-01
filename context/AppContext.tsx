
import React, { createContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { AppState, Habit } from '../types';
import { loadState, saveState } from '../services/storageService';
import { useDebounce } from '../hooks/useDebounce';
import { HABIT_COLORS } from '../constants';

type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'CHANGE_DATE'; payload: { year: number; month: number } }
  | { type: 'ADD_HABIT'; payload: { year: number; month: number; title: string } }
  | { type: 'UPDATE_HABIT_TITLE'; payload: { year: number; month: number; habitId: string; newTitle: string } }
  | { type: 'DELETE_HABIT'; payload: { year: number; month: number; habitId: string } }
  | { type: 'TOGGLE_DAY'; payload: { year: number; month: number; habitId: string; day: number } }
  | { type: 'CLEAR_HISTORY' };

interface AppContextType {
  state: AppState & { currentDate: { year: number; month: number } };
  dispatch: React.Dispatch<Action>;
}

const initialState: AppState = {
  version: '1',
  years: {},
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_STATE':
        return action.payload;
    case 'ADD_HABIT': {
      const { year, month, title } = action.payload;
      const monthKey = `${year}-${month}`;
      const newState = JSON.parse(JSON.stringify(state));

      if (!newState.years[year]) newState.years[year] = {};
      if (!newState.years[year][monthKey]) newState.years[year][monthKey] = { habits: [] };

      const existingHabits = newState.years[year][monthKey].habits;
      const nextColorIndex = existingHabits.length % HABIT_COLORS.length;
      
      const newHabit: Habit = {
        id: `h-${Date.now()}`,
        title,
        days: {},
        color: HABIT_COLORS[nextColorIndex],
      };
      
      newState.years[year][monthKey].habits.push(newHabit);
      return newState;
    }
    case 'UPDATE_HABIT_TITLE': {
        const { year, month, habitId, newTitle } = action.payload;
        const monthKey = `${year}-${month}`;
        const newState = JSON.parse(JSON.stringify(state));
        const habit = newState.years[year]?.[monthKey]?.habits.find((h: Habit) => h.id === habitId);
        if (habit) {
            habit.title = newTitle;
        }
        return newState;
    }
    case 'DELETE_HABIT': {
      const { year, month, habitId } = action.payload;
      const monthKey = `${year}-${month}`;
      const newState = JSON.parse(JSON.stringify(state));
      if (newState.years[year]?.[monthKey]) {
        newState.years[year][monthKey].habits = newState.years[year][monthKey].habits.filter(
          (h: Habit) => h.id !== habitId
        );
      }
      return newState;
    }
    case 'TOGGLE_DAY': {
      const { year, month, habitId, day } = action.payload;
      const monthKey = `${year}-${month}`;
      const newState = JSON.parse(JSON.stringify(state));
      const habit = newState.years[year]?.[monthKey]?.habits.find((h: Habit) => h.id === habitId);
      if (habit) {
        habit.days[day] = !habit.days[day];
      }
      return newState;
    }
    case 'CLEAR_HISTORY':
        return initialState;
    default:
      return state;
  }
};


const initialDateState = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
}

const dateReducer = (state: {year: number; month: number}, action: Action): {year: number; month: number} => {
    switch (action.type) {
        case 'CHANGE_DATE':
            return action.payload;
        default:
            return state;
    }
}


export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appState, appDispatch] = useReducer(appReducer, loadState() || initialState);
  const [currentDate, dateDispatch] = useReducer(dateReducer, initialDateState);

  const debouncedState = useDebounce(appState, 500);

  useEffect(() => {
    saveState(debouncedState);
  }, [debouncedState]);

  const dispatch = useCallback((action: Action) => {
    if (action.type === 'CHANGE_DATE') {
        dateDispatch(action);
    } else {
        appDispatch(action);
    }
  }, []);

  const value = {
    state: { ...appState, currentDate },
    dispatch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
   