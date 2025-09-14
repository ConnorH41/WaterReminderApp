
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { ClipPath, Defs, G, LinearGradient, Rect, Stop } from 'react-native-svg';

interface WaterBackgroundProps {
  percent: number; // 0 to 1
  children?: React.ReactNode;
}

const WaterBackground: React.FC<WaterBackgroundProps> = ({ percent, children }) => {
  const screenWidth = Dimensions.get('window').width;
  const glassWidth = Math.min(320, screenWidth - 48);
  // Reduce height so SVG fits tightly around the glass area
  const glassHeight = Math.floor(glassWidth * 1.0);

  // animated fill progress (0..1)
  const fillProgress = useSharedValue(Math.max(0, Math.min(1, percent)));
  useEffect(() => {
    fillProgress.value = withTiming(Math.max(0, Math.min(1, percent)), { duration: 600 });
  }, [percent]);

  // animated rect for clip (y and height) - this creates the water level
  const AnimatedRect = Animated.createAnimatedComponent(Rect as any);
  const animatedWaterProps = useAnimatedProps(() => {
    const p = fillProgress.value;
    const h = glassHeight * p;
    const y = glassHeight - h;
    return {
      y,
      height: h,
    } as any;
  });
  const AWaterRect: any = AnimatedRect;

  // WaterBackground now shows a glass with water; emoji support removed

  return (
    <View style={styles.container}>
      <View style={styles.centerContainer} pointerEvents="none">
        <Svg width={glassWidth} height={glassHeight}>
          <Defs>
            {/* glass fill gradient */}
            <LinearGradient id="glassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
              <Stop offset="50%" stopColor="#ffffff" stopOpacity="0.06" />
              <Stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
            </LinearGradient>

            {/* gradient for water effect - brighter and fully opaque */}
            <LinearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#00b0ff" stopOpacity="1" />
              <Stop offset="50%" stopColor="#0091ea" stopOpacity="1" />
              <Stop offset="100%" stopColor="#0077c2" stopOpacity="1" />
            </LinearGradient>

            {/* clip to keep content inside rounded glass */}
            <ClipPath id="glassClip">
              <Rect x={0} y={0} width={glassWidth} height={glassHeight} rx={24} />
            </ClipPath>
          </Defs>

          {/* glass background (subtle translucent) */}
          <Rect x={0} y={0} width={glassWidth} height={glassHeight} rx={24} fill="url(#glassGradient)" />

          {/* subtle inner highlight at top */}
          <Rect x={8} y={6} width={glassWidth - 16} height={Math.floor(glassHeight * 0.18)} rx={18} fill="#ffffff" opacity={0.06} />

          {/* glass border */}
          <Rect x={1} y={1} width={glassWidth - 2} height={glassHeight - 2} rx={22} stroke="#e6f7fb" strokeWidth={2} fill="none" />

          {/* water overlay clipped to the glass rounded rect */}
          <G clipPath="url(#glassClip)">
            <AWaterRect
              animatedProps={animatedWaterProps as any}
              x={0}
              y={0}
              width={glassWidth}
              height={glassHeight}
              fill="url(#waterGradient)"
            />

            {/* water line indicator */}
            <AWaterRect
              animatedProps={animatedWaterProps as any}
              x={0}
              width={glassWidth}
              height={2}
              fill="#0069c0"
            />
          </G>
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
    marginBottom: 100,
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
