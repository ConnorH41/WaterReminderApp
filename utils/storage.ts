import AsyncStorage from '@react-native-async-storage/async-storage';

const TODAY_KEY = `water-intake-${new Date().toISOString().slice(0, 10)}`;
const GOAL_KEY = 'water-goal';

// Helper to get date string for N days ago
const getDateKey = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return `water-intake-${date.toISOString().slice(0, 10)}`;
};

// Get last 7 days intake as array of { date, intake }
export const getIntakeHistory = async (): Promise<{ date: string; intake: number }[]> => {
  const history: { date: string; intake: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const key = getDateKey(i);
    const value = await AsyncStorage.getItem(key);
    history.push({
      date: key.replace('water-intake-', ''),
      intake: value ? parseInt(value, 10) : 0,
    });
  }
  return history.reverse(); // most recent last
};

export const getTodayIntake = async (): Promise<number> => {
  const value = await AsyncStorage.getItem(TODAY_KEY);
  return value ? parseInt(value, 10) : 0;
};


export const addCup = async (amount: number = 8): Promise<void> => {
  const current = await getTodayIntake();
  await AsyncStorage.setItem(TODAY_KEY, (current + amount).toString());
};

export const setTodayIntake = async (amount: number): Promise<void> => {
  await AsyncStorage.setItem(TODAY_KEY, amount.toString());
}

export const resetIntake = async (): Promise<void> => {
  await AsyncStorage.setItem(TODAY_KEY, '0');
};

export const getGoal = async (): Promise<number> => {
  const value = await AsyncStorage.getItem(GOAL_KEY);
  return value ? parseInt(value, 10) : 8;
};

export const setGoal = async (goal: number): Promise<void> => {
  await AsyncStorage.setItem(GOAL_KEY, goal.toString());
};
