import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SettingsScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.header}>Settings</Text>
    {/* Settings UI will go here */}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5fafd',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default SettingsScreen;
