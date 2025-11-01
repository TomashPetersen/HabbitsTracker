
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const AddHabitForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const context = useContext(AppContext);

  if (!context) return null;
  const { state, dispatch } = context;
  const { year, month } = state.currentDate;
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const selectedDate = new Date(year, month);
  const isReadOnly = selectedDate < now && !(selectedDate.getFullYear() === now.getFullYear() && selectedDate.getMonth() === now.getMonth());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch({ type: 'ADD_HABIT', payload: { year, month, title: title.trim() } });
      setTitle('');
    }
  };

  if (isReadOnly) return null;

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Новая привычка (напр. Читать 15 минут)"
        className="flex-grow bg-slate-700 border border-slate-600 text-slate-200 rounded-md px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
      />
      <button
        type="submit"
        className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2 rounded-md transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        disabled={!title.trim()}
      >
        Добавить
      </button>
    </form>
  );
};

export default AddHabitForm;
   