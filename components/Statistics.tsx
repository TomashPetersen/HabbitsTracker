import React, { useMemo } from 'react';
import { Habit } from '../types';
import { calculateStreaks, calculateCompletion } from '../utils/stats';

interface StatisticsProps {
  habit: Habit;
  daysInMonth: number;
  isReadOnly: boolean;
}

const Statistics: React.FC<StatisticsProps> = ({ habit, daysInMonth, isReadOnly }) => {
  const { completion, streaks } = useMemo(() => {
    const completion = calculateCompletion(habit, daysInMonth);
    const streaks = calculateStreaks(habit, daysInMonth, isReadOnly);
    return { completion, streaks };
  }, [habit, daysInMonth, isReadOnly]);

  return (
    <div className="flex flex-col text-center text-sm font-mono text-slate-400">
      <div title="Процент выполнения / выполнено дней">{completion.percentage}% ({completion.count})</div>
      <div className="flex gap-2 justify-center mt-1">
        <div title="Текущий стрик" className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.934l-6.794 12.42a1 1 0 00.385 1.451l.007.003a1 1 0 001.45-.385c.345-.23.614-.558.822-.934l6.794-12.42a1 1 0 00-.385-1.451z" clipRule="evenodd" /></svg>
          {streaks.currentStreak}
        </div>
        <div title="Максимальный стрик" className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" /></svg>
          {streaks.maxStreak}
        </div>
      </div>
    </div>
  );
};

export default Statistics;