
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { getDaysInMonth, getFirstDayOfMonth } from '../utils/calendar';
import { DAY_NAMES_SHORT } from '../constants';
import HabitRow from './HabitRow';

const MonthView: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { state } = context;
  const { year, month } = state.currentDate;
  const monthKey = `${year}-${month}`;
  
  const habits = state.years[year]?.[monthKey]?.habits || [];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const selectedDate = new Date(year, month);
  const isReadOnly = selectedDate < now && !(selectedDate.getFullYear() === now.getFullYear() && selectedDate.getMonth() === now.getMonth());

  return (
    <div className="overflow-x-auto">
      {isReadOnly && (
        <div className="text-center p-2 mb-4 bg-yellow-900/50 text-yellow-300 rounded-md border border-yellow-700">
          Это прошлый месяц (только просмотр).
        </div>
      )}
      {habits.length > 0 ? (
        <div className="grid gap-x-1" style={{ gridTemplateColumns: `minmax(150px, 1.5fr) repeat(${daysInMonth}, minmax(36px, 1fr)) minmax(120px, 1fr)`}}>
          {/* Header Row: Habit Title */}
          <div className="sticky left-0 bg-slate-800 z-10 font-semibold text-slate-400 text-sm text-left p-2">Привычка</div>
          
          {/* Header Row: Days */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
            <div key={day} className={`text-center font-mono text-sm p-2 rounded-md ${isCurrentMonth && day === today.getDate() ? 'bg-sky-700 text-white' : 'text-slate-400'}`}>
                <span className="hidden sm:inline">{DAY_NAMES_SHORT[(firstDayOfMonth + day - 1) % 7]}</span>
                <span className="sm:hidden">{day}</span>
                <span className="hidden sm:block">{day}</span>
            </div>
          ))}
          
          {/* Header Row: Stats Title */}
          <div className="font-semibold text-slate-400 text-sm text-center p-2">Статистика</div>
          
          {/* Habit Rows */}
          {habits.map(habit => (
            <HabitRow
              key={habit.id}
              habit={habit}
              year={year}
              month={month}
              daysInMonth={daysInMonth}
              firstDayOfMonth={firstDayOfMonth}
              isReadOnly={isReadOnly}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          <p>Привычек на этот месяц еще нет.</p>
          <p>Добавьте первую, чтобы начать!</p>
        </div>
      )}
    </div>
  );
};

export default MonthView;
   