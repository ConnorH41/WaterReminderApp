import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WaterBackground from '../../components/WaterBackground';
import WaterButton from '../../components/WaterButton';
import { subscribe as subscribeEvent } from '../../utils/eventBus';
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
    const unsubGoal = subscribeEvent('goalChanged', (p: any) => {
      if (p && p.goal) setGoal(p.goal);
    });
    return () => { unsubGoal && unsubGoal(); };
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
  // emoji support removed from Home; selection remains in Settings

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

  const waterLevelPercent = interactive
    ? Math.min(tempIntake / goal, 1)
    : Math.min(intake / goal, 1);

  // PanResponder for interactive water level
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => interactive,
    onMoveShouldSetPanResponder: () => interactive,
    onPanResponderMove: (evt, gestureState) => {
      if (!interactive) return;
  const y = gestureState.moveY - 80; // offset for header
  const winHeight = Dimensions.get('window').height;
  const boundedY = Math.max(0, Math.min(winHeight, y));
  const percent = 1 - boundedY / winHeight;
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
  <WaterBackground percent={waterLevelPercent}>
      <View
        style={styles.overlayContent}
        {...(interactive ? panResponder.panHandlers : {})}
      >
        <View style={styles.topStats} pointerEvents="none">
          <Text style={styles.ozText}>
            {interactive ? `${tempIntake} oz` : `${intake} oz`}
          </Text>
          <Text style={styles.percentText}>
            {goal > 0
              ? `${Math.min(100, Math.round(((interactive ? tempIntake : intake) / goal) * 100))}%`
              : '0%'}
          </Text>
        </View>
        {/* header and subtitle removed per user request */}
        {/* emoji picker moved to Settings */}
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
    </WaterBackground>
  );
};

const styles = StyleSheet.create({
  // container and waterBackground removed, now handled by WaterBackground
  // waterLevel removed, now handled by WaterBackground
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
  // header and subtitle removed
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1de9b6',
    marginBottom: 8,
    textShadowColor: '#eaf6fb',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  topStats: {
    position: 'absolute',
    top: 120,
    alignItems: 'center',
    zIndex: 3,
  },
  ozText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2196f3',
    marginBottom: 4,
  },
  percentText: {
    fontSize: 16,
    color: '#00796b',
    fontWeight: '600',
  },
  emojiPicker: {
    position: 'absolute',
    top: 180,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    zIndex: 3,
  },
  emojiOption: {
    padding: 6,
    borderRadius: 8,
  },
  emojiOptionText: {
    fontSize: 22,
  },
  emojiSelected: {
    transform: [{ scale: 1.2 }],
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
