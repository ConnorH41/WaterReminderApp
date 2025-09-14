
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

interface WaterBackgroundProps {
  percent: number; // 0 to 1
  children?: React.ReactNode;
}

const WaterBackground: React.FC<WaterBackgroundProps> = ({ percent, children }) => {
  const screenWidth = Dimensions.get('window').width;
  const glassWidth = Math.min(320, screenWidth - 48);
  // Use full window height for a background water fill
  const svgWidth = screenWidth;
  const svgHeight = Math.floor(Dimensions.get('window').height);

  // animated fill progress (0..1)
  const fillProgress = useSharedValue(Math.max(0, Math.min(1, percent)));
  useEffect(() => {
    fillProgress.value = withTiming(Math.max(0, Math.min(1, percent)), { duration: 600 });
  }, [percent]);

  // animated rect for clip (y and height) - this creates the water level
  const AnimatedRect = Animated.createAnimatedComponent(Rect as any);
  const animatedWaterProps = useAnimatedProps(() => {
    const p = fillProgress.value;
    const h = svgHeight * p;
    const y = svgHeight - h;
    return {
      y,
      height: h,
    } as any;
  });
  const AWaterRect: any = AnimatedRect;

  // WaterBackground now shows a glass with water; emoji support removed

  return (
    <View style={styles.container}>
      {/* full-window water background */}
      <View style={styles.waterSvg} pointerEvents="none">
        <Svg width={svgWidth} height={svgHeight}>
          <Defs>
            {/* gradient for water effect - brighter and fully opaque */}
            <LinearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#00b0ff" stopOpacity="1" />
              <Stop offset="50%" stopColor="#0091ea" stopOpacity="1" />
              <Stop offset="100%" stopColor="#0077c2" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          <AWaterRect
            animatedProps={animatedWaterProps as any}
            x={0}
            y={0}
            width={svgWidth}
            height={svgHeight}
            fill="url(#waterGradient)"
          />

          {/* water line indicator */}
          <AWaterRect
            animatedProps={animatedWaterProps as any}
            x={0}
            width={svgWidth}
            height={3}
            fill="#0069c0"
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
  centerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 120,
  },
  waterSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  // overlay content (children) sits over the glass
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
