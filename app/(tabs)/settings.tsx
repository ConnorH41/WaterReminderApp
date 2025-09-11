import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TextInput, View, TouchableOpacity, Keyboard } from 'react-native';
import { requestNotificationPermissions, scheduleWaterReminders } from '../../utils/notifications';
import { getGoal, setGoal } from '../../utils/storage';

const SettingsScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [goal, setGoalState] = useState(8);
  const [goalInput, setGoalInput] = useState('8');

  useEffect(() => {
    const fetchGoal = async () => {
      const storedGoal = await getGoal();
      setGoalState(storedGoal);
      setGoalInput(storedGoal.toString());
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

  return (
    <View style={styles.container}>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
    backgroundColor: '#00bfff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  doneText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SettingsScreen;
