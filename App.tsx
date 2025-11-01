
import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';
import Header from './components/Header';
import MonthView from './components/MonthView';
import AddHabitForm from './components/AddHabitForm';

const App: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="min-h-screen font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-sky-400">MonthHabit</h1>
            <p className="text-slate-400 mt-2">Отслеживайте свои привычки. Месяц за месяцем.</p>
          </div>
          
          <div className="bg-slate-800 rounded-xl shadow-2xl p-4 sm:p-6">
            <Header />
            <div className="mt-6">
              <MonthView />
              <AddHabitForm />
            </div>
          </div>
        </div>
        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>Создано с помощью React, Tailwind CSS и Gemini</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
   