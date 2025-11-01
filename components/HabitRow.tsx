
import React, { useContext, useState, useEffect } from 'react';
import { Habit } from '../types';
import { AppContext } from '../context/AppContext';
import Statistics from './Statistics';
import ConfirmationModal from './ConfirmationModal';
import { useDebounce } from '../hooks/useDebounce';

interface HabitRowProps {
  habit: Habit;
  year: number;
  month: number;
  daysInMonth: number;
  firstDayOfMonth: number;
  isReadOnly: boolean;
}

const HabitRow: React.FC<HabitRowProps> = ({ habit, year, month, daysInMonth, isReadOnly }) => {
  const context = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(habit.title);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const debouncedTitle = useDebounce(title, 500);

  useEffect(() => {
    if (debouncedTitle !== habit.title) {
      context?.dispatch({ type: 'UPDATE_HABIT_TITLE', payload: { year, month, habitId: habit.id, newTitle: debouncedTitle } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle]);

  if (!context) return null;
  const { dispatch } = context;

  const handleToggleDay = (day: number) => {
    if (isReadOnly) return;
    dispatch({ type: 'TOGGLE_DAY', payload: { year, month, habitId: habit.id, day } });
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_HABIT', payload: { year, month, habitId: habit.id } });
    setIsDeleteModalOpen(false);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    if (title.trim() === '') {
      setTitle(habit.title); // Revert if empty
    }
  };

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <>
      {/* Habit Title Cell */}
      <div className="sticky left-0 bg-slate-800 z-10 flex items-center gap-2 p-2 border-t border-slate-700">
        <div className="w-2 h-full rounded-full" style={{ backgroundColor: habit.color }}></div>
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
            className="w-full bg-slate-700 text-white p-1 rounded-md"
            autoFocus
          />
        ) : (
          <span onDoubleClick={() => !isReadOnly && setIsEditing(true)} className="flex-grow cursor-pointer">{habit.title}</span>
        )}
        <button onClick={() => setIsDeleteModalOpen(true)} disabled={isReadOnly} className="ml-auto text-slate-500 hover:text-red-500 disabled:opacity-30 disabled:hover:text-slate-500 p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
        </button>
      </div>

      {/* Day Checkboxes */}
      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
        const isChecked = habit.days[day];
        const isToday = isCurrentMonth && day === today.getDate();
        return (
          <div key={day} className={`flex items-center justify-center p-1 border-t border-slate-700 ${isToday ? 'bg-slate-700/50' : ''}`}>
            <input
              type="checkbox"
              checked={!!isChecked}
              onChange={() => handleToggleDay(day)}
              disabled={isReadOnly}
              className={`w-5 h-5 rounded-sm appearance-none border-2 border-slate-600 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 checked:border-transparent`}
              style={isChecked ? { backgroundColor: habit.color } : {}}
            />
          </div>
        );
      })}

      {/* Statistics Cell */}
      <div className="flex items-center justify-center p-2 border-t border-slate-700">
        <Statistics habit={habit} daysInMonth={daysInMonth} isReadOnly={isReadOnly} />
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Удалить привычку?"
        message={`Вы уверены, что хотите удалить привычку "${habit.title}"? Это действие необратимо.`}
      />
    </>
  );
};

export default HabitRow;
   