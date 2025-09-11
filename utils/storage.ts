import AsyncStorage from '@react-native-async-storage/async-storage';

const TODAY_KEY = `water-intake-${new Date().toISOString().slice(0, 10)}`;
const GOAL_KEY = 'water-goal';

export const getTodayIntake = async (): Promise<number> => {
  const value = await AsyncStorage.getItem(TODAY_KEY);
  return value ? parseInt(value, 10) : 0;
};

export const addCup = async (): Promise<void> => {
  const current = await getTodayIntake();
  await AsyncStorage.setItem(TODAY_KEY, (current + 1).toString());
};

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
