
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import Svg, { Rect, Defs, ClipPath, G } from 'react-native-svg';

interface WaterBackgroundProps {
  percent: number; // 0 to 1
  children?: React.ReactNode;
}

// No animated Path needed after removing wave

const WaterBackground: React.FC<WaterBackgroundProps> = ({ percent, children }) => {
  const screenWidth = Dimensions.get('window').width;
  const glassWidth = Math.min(320, screenWidth - 48);
  const glassHeight = 420;

  // animated fill progress (0..1)
  const fillProgress = useSharedValue(Math.max(0, Math.min(1, percent)));
  useEffect(() => {
    fillProgress.value = withTiming(Math.max(0, Math.min(1, percent)), { duration: 600 });
  }, [percent]);

  // animated rect for clip (y and height)
  const AnimatedRect = Animated.createAnimatedComponent(Rect as any);
  const animatedRectProps = useAnimatedProps(() => {
    const p = fillProgress.value;
    const h = glassHeight * p;
    const y = glassHeight - h;
    return {
      y,
      height: h,
    } as any;
  });
  const ARect: any = AnimatedRect;

  // (removed animated wave) keep only animated rect for clean fill

  return (
    <View style={styles.container}>
      <View style={styles.centerContainer} pointerEvents="none">
        <Svg width={glassWidth} height={glassHeight}>
          <Defs>
            <ClipPath id="glassClip">
              <Rect x={0} y={0} width={glassWidth} height={glassHeight} rx={24} />
            </ClipPath>
          </Defs>

          {/* glass background */}
          <Rect x={0} y={0} width={glassWidth} height={glassHeight} rx={24} fill="#ffffff" opacity={0.6} />

          {/* water group clipped to glass */}
          <G clipPath="url(#glassClip)">
            <ARect animatedProps={animatedRectProps as any} x={0} width={glassWidth} rx={0} fill="#26c6da" />
          </G>

          {/* glass border */}
          <Rect x={2} y={2} width={glassWidth - 4} height={glassHeight - 4} rx={22} stroke="#bfeff6" strokeWidth={2} fill="none" />
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
    marginBottom: 180,
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
