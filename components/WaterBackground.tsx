
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withRepeat, withTiming } from 'react-native-reanimated';

interface WaterBackgroundProps {
  percent: number; // 0 to 1
  children?: React.ReactNode;
}


const AnimatedPath = Animated.createAnimatedComponent(Path);

const WaterBackground: React.FC<WaterBackgroundProps> = ({ percent, children }) => {
  const windowHeight = Dimensions.get('window').height;
  const waterHeight = Math.round(windowHeight * percent);
  const waveWidth = Dimensions.get('window').width;
  const waveHeight = 24;

  // Animation value for horizontal wave offset
  const waveOffset = useSharedValue(0);

  useEffect(() => {
    waveOffset.value = withRepeat(withTiming(waveWidth, { duration: 3000 }), -1, true);
  }, [waveWidth]);

  // Animated wave path
  const animatedProps = useAnimatedProps(() => {
    // Animate the wave horizontally
    const offset = waveOffset.value % waveWidth;
    // Generate a sine wave path
    let path = `M 0 ${waveHeight/2}`;
    for (let x = 0; x <= waveWidth; x += 8) {
      const y = waveHeight/2 + Math.sin((x + offset) * 0.04) * (waveHeight/2);
      path += ` L ${x} ${y}`;
    }
    path += ` L ${waveWidth} ${waveHeight} L 0 ${waveHeight} Z`;
    return { d: path };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.waterLevel, { height: waterHeight }]}>
        <Svg
          width={waveWidth}
          height={waveHeight}
          style={{ position: 'absolute', top: -waveHeight, left: 0 }}
        >
          <AnimatedPath
            animatedProps={animatedProps}
            fill="#26c6da"
            opacity={0.9}
          />
        </Svg>
      </View>
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
