import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface WaterButtonProps {
  onPress: () => void;
}

const WaterButton: React.FC<WaterButtonProps> = ({ onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
  <Text style={styles.text}>+ Add 8oz</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#00bfff',
    padding: 24,
    borderRadius: 50,
    alignItems: 'center',
    marginVertical: 16,
  },
  text: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default WaterButton;
