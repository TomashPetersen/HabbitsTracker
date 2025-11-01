import React, { useContext, useRef, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { MONTH_NAMES } from '../constants';
import { exportData, importData } from '../services/storageService';
import ConfirmationModal from './ConfirmationModal';

const Header: React.FC = () => {
  const context = useContext(AppContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!context) return null;
  const { state, dispatch } = context;
  const { year, month } = state.currentDate;

  const handlePrevMonth = () => {
    const newDate = new Date(year, month - 1);
    dispatch({ type: 'CHANGE_DATE', payload: { year: newDate.getFullYear(), month: newDate.getMonth() } });
  };

  const handleNextMonth = () => {
    const newDate = new Date(year, month + 1);
    dispatch({ type: 'CHANGE_DATE', payload: { year: newDate.getFullYear(), month: newDate.getMonth() } });
  };

  const handleExport = () => {
    exportData(state);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (window.confirm("Вы уверены, что хотите импортировать данные? Текущие данные будут заменены (но сохранятся в резервной копии).")) {
        importData(file, (newState) => {
            dispatch({ type: 'SET_STATE', payload: newState });
        });
      }
    }
  };
  
  const handleClearHistory = () => {
    dispatch({ type: 'CLEAR_HISTORY' });
    setIsModalOpen(false);
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button onClick={handlePrevMonth} className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          </button>
          <span className="text-xl font-semibold w-40 text-center">{MONTH_NAMES[month]} {year}</span>
          <button onClick={handleNextMonth} className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <button className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-md shadow-lg z-10 hidden group-hover:block">
              <a href="#" onClick={handleExport} className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 rounded-t-md">Экспорт JSON</a>
              <a href="#" onClick={handleImportClick} className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-600">Импорт JSON</a>
              <a href="#" onClick={() => setIsModalOpen(true)} className="block px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white rounded-b-md">Очистить историю</a>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleClearHistory}
        title="Подтвердите действие"
        message="Вы уверены, что хотите полностью очистить всю историю? Это действие необратимо."
      />
    </>
  );
};

export default Header;