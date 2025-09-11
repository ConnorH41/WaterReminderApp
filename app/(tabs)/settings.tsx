import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import WaterBackground from '../../components/WaterBackground';
import { requestNotificationPermissions, scheduleWaterReminders } from '../../utils/notifications';
import { getGoal, getTodayIntake, setGoal } from '../../utils/storage';

const SettingsScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [goal, setGoalState] = useState(8);
  const [todayIntake, setTodayIntake] = useState(0);
  const [goalInput, setGoalInput] = useState('8');

  useEffect(() => {
    const fetchGoal = async () => {
      const storedGoal = await getGoal();
      setGoalState(storedGoal);
      setGoalInput(storedGoal.toString());
      setTodayIntake(await getTodayIntake());
    };
    fetchGoal();
  }, []);

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    if (value) {
      await requestNotificationPermissions();
      await scheduleWaterReminders();
      Alert.alert('Reminders enabled', 'You will get water reminders every 2 hours.');
    } else {
      await scheduleWaterReminders();
      await import('expo-notifications').then(mod => mod.cancelAllScheduledNotificationsAsync());
      Alert.alert('Reminders disabled', 'You will not receive water reminders.');
    }
  };

  const handleGoalChange = async (text: string) => {
    setGoalInput(text.replace(/[^0-9]/g, ''));
  };

  const handleGoalSubmit = async () => {
    const newGoal = parseInt(goalInput, 10);
    if (!isNaN(newGoal) && newGoal > 0) {
      await setGoal(newGoal);
      setGoalState(newGoal);
      Alert.alert('Goal updated', `Your daily goal is now ${newGoal} cups.`);
    } else {
      Alert.alert('Invalid goal', 'Please enter a valid number greater than 0.');
      setGoalInput(goal.toString());
    }
  };

  const percent = goal > 0 ? Math.min(todayIntake / goal, 1) : 0;
  return (
    <WaterBackground percent={percent}>
      <Text style={styles.header}>Settings</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Water Reminders</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggleNotifications}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Daily Goal (oz)</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={styles.input}
            value={goalInput}
            keyboardType="number-pad"
            onChangeText={handleGoalChange}
            onBlur={handleGoalSubmit}
            onSubmitEditing={handleGoalSubmit}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => { handleGoalSubmit(); Keyboard.dismiss(); }}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </WaterBackground>
  );
};


const styles = StyleSheet.create({
  // container removed, now handled by WaterBackground
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#2196f3',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#b2ebf2',
  },
  label: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#b2ebf2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 18,
    width: 60,
    textAlign: 'center',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  doneButton: {
    backgroundColor: '#1de9b6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  doneText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SettingsScreen;
