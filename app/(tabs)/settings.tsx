import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { emit } from '../../utils/eventBus';
import { requestNotificationPermissions, scheduleWaterReminders } from '../../utils/notifications';
import { getEmoji, getGoal, getMetric, getTodayIntake, setEmoji, setGoal, setMetric } from '../../utils/storage';

const SettingsScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [goal, setGoalState] = useState(8);
  const [todayIntake, setTodayIntake] = useState(0);
    const [emojiLocal, setEmojiLocal] = useState('💧');
    const [pickerVisible, setPickerVisible] = useState(false);
    const [pendingEmoji, setPendingEmoji] = useState(emojiLocal);
    const [goalPickerVisible, setGoalPickerVisible] = useState(false);
    const [metric, setMetricLocal] = useState<'imperial'|'metric'>('imperial');
    const [pendingMetric, setPendingMetric] = useState<'imperial'|'metric'>(metric);
    const [pendingGoalValue, setPendingGoalValue] = useState(goal.toString());

  useEffect(() => {
    const fetchGoal = async () => {
  const storedGoal = await getGoal();
  setGoalState(storedGoal);
      setTodayIntake(await getTodayIntake());
      setEmojiLocal(await getEmoji());
      setMetricLocal(await getMetric());
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


  const percent = goal > 0 ? Math.min(todayIntake / goal, 1) : 0;
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <View style={styles.content}>
      <View style={styles.row}>
        <Text style={styles.label}>Water Reminders</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggleNotifications}
        />
      </View>
      {/* Daily Goal now changed via the modal below */}
      <View style={styles.row}>
        <Text style={styles.label}>Daily Goal</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.goalPreview}>{goal} oz</Text>
          <TouchableOpacity style={styles.changeButton} onPress={() => { setPendingMetric(metric); setPendingGoalValue(goal.toString()); setGoalPickerVisible(true); }}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Emoji</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.emojiPreview}>{emojiLocal}</Text>
          <TouchableOpacity style={styles.changeButton} onPress={() => { setPendingEmoji(emojiLocal); setPickerVisible(true); }}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={pickerVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Emoji</Text>
            <View style={styles.modalGrid}>
              {['💧','🐙','🐢','🦕','🍉','🥤'].map(e => (
                <TouchableOpacity key={e} onPress={() => setPendingEmoji(e)} style={[styles.modalEmojiOption, pendingEmoji === e ? styles.modalEmojiSelected : undefined]}>
                  <Text style={styles.modalEmojiText}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setPickerVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={async () => { await setEmoji(pendingEmoji); setEmojiLocal(pendingEmoji); setPickerVisible(false); emit('emojiChanged', pendingEmoji); Alert.alert('Saved', 'Emoji updated'); }}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={goalPickerVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Daily Goal</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
              <TouchableOpacity onPress={() => setPendingMetric('imperial')} style={[styles.metricOption, pendingMetric === 'imperial' ? styles.metricSelected : undefined]}>
                <Text>oz</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPendingMetric('metric')} style={[styles.metricOption, pendingMetric === 'metric' ? styles.metricSelected : undefined]}>
                <Text>ml</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={pendingGoalValue}
              keyboardType="number-pad"
              onChangeText={(t) => setPendingGoalValue(t.replace(/[^0-9]/g, ''))}
            />
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setGoalPickerVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={async () => {
                const val = parseInt(pendingGoalValue, 10);
                if (isNaN(val) || val <= 0) { Alert.alert('Invalid', 'Please enter a valid number'); return; }
                // convert metric ml to oz if needed
                let storedOunces = val;
                if (pendingMetric === 'metric') {
                  storedOunces = Math.round(val / 29.5735);
                }
                await setGoal(storedOunces);
                await setMetric(pendingMetric);
                setGoalState(storedOunces);
                setMetricLocal(pendingMetric);
                setGoalPickerVisible(false);
                emit('goalChanged', { goal: storedOunces, metric: pendingMetric });
                Alert.alert('Saved', 'Daily goal updated');
              }}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f7feff',
  },
  header: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#2196f3',
    zIndex: 3,
  },
  content: {
    paddingTop: 180,
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
  emojiOption: {
    padding: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  emojiOptionText: {
    fontSize: 22,
  },
  emojiSelected: {
    transform: [{ scale: 1.2 }],
  },
  emojiPreview: {
    fontSize: 24,
    marginRight: 12,
  },
  changeButton: {
    backgroundColor: '#1e88e5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  modalEmojiOption: {
    padding: 8,
    borderRadius: 8,
  },
  modalEmojiSelected: {
    backgroundColor: '#e0f7fa',
  },
  modalEmojiText: {
    fontSize: 32,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancel: {
    padding: 12,
  },
  modalCancelText: {
    color: '#666',
  },
  modalSave: {
    backgroundColor: '#1de9b6',
    padding: 12,
    borderRadius: 8,
  },
  modalSaveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  goalPreview: {
    fontSize: 18,
    marginRight: 12,
  },
  metricOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  metricSelected: {
    backgroundColor: '#e0f7fa',
    borderColor: '#1de9b6',
  },
});

export default SettingsScreen;
