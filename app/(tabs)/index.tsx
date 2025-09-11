import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProgressCircle from '../../components/ProgressCircle';
import WaterButton from '../../components/WaterButton';
import { addCup, getGoal, getTodayIntake, resetIntake } from '../../utils/storage';

const HomeScreen: React.FC = () => {
  const [intake, setIntake] = useState(0);
  const [goal, setGoal] = useState(64); // default 64oz
  const [lastCheckedDate, setLastCheckedDate] = useState(new Date().toISOString().slice(0, 10));

  // Fetch intake and goal on mount
  useEffect(() => {
    const fetchData = async () => {
      setIntake(await getTodayIntake());
      setGoal(await getGoal());
    };
    fetchData();
  }, []);

  // Daily reset logic: check for date change every minute
  useEffect(() => {
    const interval = setInterval(async () => {
      const today = new Date().toISOString().slice(0, 10);
      if (today !== lastCheckedDate) {
        await resetIntake();
        setIntake(0);
        setLastCheckedDate(today);
      }
    }, 60000); // check every minute
    return () => clearInterval(interval);
  }, [lastCheckedDate]);

  const handleAddCup = async () => {
    await addCup(8); // add 8oz per press
    setIntake(await getTodayIntake());
  };

  const handleReset = async () => {
    await resetIntake();
    setIntake(0);
    setLastCheckedDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <View style={styles.container}>
  <Text style={styles.header}>Water Reminder</Text>
      <Text style={styles.subtitle}>Stay hydrated!</Text>
      <View style={styles.progressWrapper}>
    <ProgressCircle progress={intake} goal={goal} unit="oz" />
      </View>
      <WaterButton onPress={handleAddCup} />
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetText}>Reset Day</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eaf6fb',
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2196f3',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
  },
  progressWrapper: {
    marginBottom: 32,
  },
  resetButton: {
    backgroundColor: '#ffa726',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 8,
    alignSelf: 'center',
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  resetText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
