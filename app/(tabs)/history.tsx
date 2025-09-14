import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { getGoal, getIntakeHistory, getTodayIntake } from '../../utils/storage';

const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<{ date: string; intake: number }[]>([]);
  const [todayIntake, setTodayIntake] = useState(0);
  const [goal, setGoal] = useState(8);

  useEffect(() => {
    const fetchData = async () => {
      setHistory(await getIntakeHistory());
      setTodayIntake(await getTodayIntake());
      setGoal(await getGoal());
    };
    fetchData();
  }, []);

  const percent = goal > 0 ? Math.min(todayIntake / goal, 1) : 0;
  return (
    <View style={styles.container}>
      <Text style={styles.header}>History</Text>
      <FlatList
        data={history}
        keyExtractor={item => item.date}
        contentContainerStyle={{ paddingTop: 180 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.intake}>{item.intake} oz</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No history yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#eaf6fb',
  },
  // container removed, now handled by WaterBackground
  header: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#2196f3',
    zIndex: 3,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#b2ebf2',
  },
  date: {
    fontSize: 16,
    color: '#555',
  },
  intake: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00bfae',
  },
  empty: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 32,
    textAlign: 'center',
  },
});

export default HistoryScreen;
