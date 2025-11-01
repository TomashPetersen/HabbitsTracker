
import { AppState } from '../types';

const STORAGE_KEY = 'monthhabit_v1';
const BACKUP_KEY = 'monthhabit_backup';

export const saveState = (state: AppState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error("Не удалось сохранить состояние:", error);
    alert("Ошибка! Не удалось сохранить данные. Возможно, хранилище переполнено.");
  }
};

export const loadState = (): AppState | undefined => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    // TODO: Add migration logic here if state.version changes
    return JSON.parse(serializedState) as AppState;
  } catch (error) {
    console.error("Не удалось загрузить состояние:", error);
    return undefined;
  }
};

export const exportData = (state: AppState) => {
  try {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `monthhabit_backup_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error("Ошибка экспорта:", error);
    alert("Не удалось экспортировать данные.");
  }
};

export const importData = (file: File, callback: (newState: AppState) => void) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const result = event.target?.result;
      if (typeof result === 'string') {
        const newState = JSON.parse(result) as AppState;
        // Basic validation
        if (newState.version && newState.years) {
          const currentState = loadState();
          if (currentState) {
            localStorage.setItem(BACKUP_KEY, JSON.stringify(currentState));
            console.log("Текущее состояние сохранено в резервную копию.");
          }
          callback(newState);
          alert("Данные успешно импортированы!");
        } else {
          throw new Error("Неверный формат файла.");
        }
      }
    } catch (error) {
      console.error("Ошибка импорта:", error);
      alert(`Не удалось импортировать данные. Убедитесь, что это корректный JSON файл. Ошибка: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  reader.readAsText(file);
};
   