import { Habit } from '../types';

export const calculateStreaks = (habit: Habit, totalDays: number, isPastMonth: boolean) => {
  let maxStreak = 0;
  let currentStreak = 0;
  let dayStreak = 0;

  const today = new Date();
  const limit = isPastMonth ? totalDays : today.getDate();

  for (let i = 1; i <= totalDays; i++) {
    if (habit.days[i]) {
      dayStreak++;
    } else {
      if (dayStreak > maxStreak) {
        maxStreak = dayStreak;
      }
      dayStreak = 0;
    }
  }
  if (dayStreak > maxStreak) {
    maxStreak = dayStreak;
  }
  
  // Calculate current streak
  let tempCurrentStreak = 0;
  for (let i = limit; i >= 1; i--) {
      if (habit.days[i]) {
          tempCurrentStreak++;
      } else {
          break;
      }
  }
  currentStreak = tempCurrentStreak;

  return { maxStreak, currentStreak };
};

export const calculateCompletion = (habit: Habit, totalDays: number) => {
    const completedDays = Object.values(habit.days).filter(Boolean).length;
    if (totalDays === 0) return { percentage: 0, count: 0 };
    const percentage = Math.round((completedDays / totalDays) * 100);
    return { percentage, count: completedDays };
}