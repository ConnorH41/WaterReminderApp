import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WaterButton from '../../components/WaterButton';
import { addCup, getGoal, getTodayIntake, resetIntake, setTodayIntake } from '../../utils/storage';

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

  const [interactive, setInteractive] = useState(false);
  const [tempIntake, setTempIntake] = useState(intake);
  // Remove addAmount state

  const handleAddButton = () => {
    setInteractive(true);
    setTempIntake(intake);
  };

  const handleConfirm = async () => {
    await setTodayIntake(tempIntake);
    setIntake(await getTodayIntake());
    setInteractive(false);
  };

  const handleReset = async () => {
    await resetIntake();
    setIntake(0);
    setLastCheckedDate(new Date().toISOString().slice(0, 10));
  };

  const windowHeight = Dimensions.get('window').height;
  const waterLevelPercent = interactive
    ? Math.min(tempIntake / goal, 1)
    : Math.min(intake / goal, 1);
  const waterHeight = Math.round(windowHeight * waterLevelPercent);

  // PanResponder for interactive water level
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => interactive,
    onMoveShouldSetPanResponder: () => interactive,
    onPanResponderMove: (evt, gestureState) => {
      if (!interactive) return;
      const y = gestureState.moveY - 80; // offset for header
      const boundedY = Math.max(0, Math.min(windowHeight, y));
      const percent = 1 - boundedY / windowHeight;
      const newIntake = Math.round(percent * goal);
      setTempIntake(Math.max(0, Math.min(goal, newIntake)));
    },
  });

  const handleQuickAdd = async () => {
    Alert.prompt(
      'Quick Add',
      'Enter amount to add (oz):',
      async (input) => {
        const amount = parseInt(input, 10);
        if (!isNaN(amount) && amount > 0) {
          await addCup(amount);
          setIntake(await getTodayIntake());
        }
      },
      'plain-text',
      '',
      'number-pad'
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.waterBackground}
        {...(interactive ? panResponder.panHandlers : {})}
      >
        <View style={[styles.waterLevel, { height: waterHeight }]} />
        <View style={styles.overlayContent}>
          <Text style={styles.header}>Water Reminder</Text>
          <Text style={styles.subtitle}>Stay hydrated!</Text>
          <Text style={styles.levelText}>
            {interactive
              ? `${tempIntake} / ${goal} oz`
              : `${intake} / ${goal} oz`}
          </Text>
          {!interactive ? (
            <View style={styles.bottomButtons}>
              <WaterButton onPress={handleAddButton} amount={'Edit Water Intake'} />
              <TouchableOpacity style={styles.addButton} onPress={handleQuickAdd}>
                <Text style={styles.addText}>Quick Add</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaf6fb',
    padding: 0,
  },
  waterBackground: {
    flex: 1,
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#eaf6fb',
    overflow: 'hidden',
  },
  waterLevel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#26c6da',
    zIndex: 1,
  },
  overlayContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2196f3',
    textShadowColor: '#b2ebf2',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1de9b6',
    marginBottom: 8,
    textShadowColor: '#eaf6fb',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  // input removed
  intakeLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196f3',
    marginBottom: 8,
  },
  quickAddLabel: {
    fontSize: 16,
    color: '#555',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#1de9b6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#1de9b6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginTop: 16,
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  confirmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
