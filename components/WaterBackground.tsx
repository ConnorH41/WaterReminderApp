import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

interface WaterBackgroundProps {
  percent: number; // 0 to 1
  children?: React.ReactNode;
}

const WaterBackground: React.FC<WaterBackgroundProps> = ({ percent, children }) => {
  const windowHeight = Dimensions.get('window').height;
  const waterHeight = Math.round(windowHeight * percent);
  return (
    <View style={styles.container}>
      <View style={[styles.waterLevel, { height: waterHeight }]} />
      <View style={styles.overlayContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default WaterBackground;
