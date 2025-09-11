import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface WaterButtonProps {
  onPress: () => void;
  amount?: string;
}

const WaterButton: React.FC<WaterButtonProps> = ({ onPress, amount }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.text}>{amount || '+ Add oz'}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1de9b6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
    marginVertical: 0,
    marginLeft: 8,
    minWidth: 120,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default WaterButton;
