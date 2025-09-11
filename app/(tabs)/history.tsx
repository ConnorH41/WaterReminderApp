import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { getIntakeHistory } from '../../utils/storage';

const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<{ date: string; intake: number }[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getIntakeHistory();
      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const todayStr = `${yyyy}-${mm}-${dd}`;
      // Remove current day from history
      const filtered = data.filter(d => d.date !== todayStr);
      // Sort by date descending (most recent first)
      const sorted = [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1));
      setHistory(sorted);
    };
    fetchHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>History</Text>
      <FlatList
        data={history}
        keyExtractor={item => item.date}
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#eaf6fb',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#2196f3',
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
