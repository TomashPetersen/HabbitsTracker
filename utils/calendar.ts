
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  // Returns 0 for Sunday, 1 for Monday, etc. We'll adjust to 0 for Monday.
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Adjust so Monday is 0
};
   