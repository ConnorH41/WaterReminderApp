import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProgressCircle from '../../components/ProgressCircle';
import WaterButton from '../../components/WaterButton';
import { getTodayIntake, addCup, resetIntake, getGoal } from '../../utils/storage';

const HomeScreen: React.FC = () => {
  const [intake, setIntake] = useState(0);
  const [goal, setGoal] = useState(8);

  useEffect(() => {
    const fetchData = async () => {
      setIntake(await getTodayIntake());
      setGoal(await getGoal());
    };
    fetchData();
  }, []);

  const handleAddCup = async () => {
    await addCup();
    setIntake(await getTodayIntake());
  };

  const handleReset = async () => {
    await resetIntake();
    setIntake(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>💧 Water Reminder</Text>
      <Text style={styles.subtitle}>Stay hydrated!</Text>
      <View style={styles.progressWrapper}>
        <ProgressCircle progress={intake} goal={goal} />
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
    backgroundColor: '#f5fafd',
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#00bfff',
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
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 8,
    alignSelf: 'center',
  },
  resetText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
