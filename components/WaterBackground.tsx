
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { ClipPath, Defs, Rect, Text as SvgText } from 'react-native-svg';

interface WaterBackgroundProps {
  percent: number; // 0 to 1
  children?: React.ReactNode;
  emoji?: string;
}

// No animated Path needed after removing wave

const WaterBackground: React.FC<WaterBackgroundProps> = ({ percent, children, emoji }) => {
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

  // animated props for an overlay rect that covers the unfilled top area
  const animatedOverlayProps = useAnimatedProps(() => {
    const p = fillProgress.value;
    const h = glassHeight * p;
    const overlayHeight = glassHeight - h;
    return {
      y: 0,
      height: overlayHeight,
    } as any;
  });
  const AOverlayRect: any = AnimatedRect;

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
          <Rect x={0} y={0} width={glassWidth} height={glassHeight} rx={24} fill="#ffffff" opacity={0.8} />

          {/* grey (empty) emoji - slightly transparent so blue fill shows through */}
          <SvgText
            x={glassWidth / 2}
            y={glassHeight / 2 + 10}
            fontSize={Math.floor(glassWidth * 0.7)}
            fill="#bdbdbd"
            opacity={0.32}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {emoji ?? '💧'}
          </SvgText>

          {/* colored emoji (full). We'll cover the top unfilled area with an animated overlay rect so the blue only shows at the bottom */}
          <SvgText
            x={glassWidth / 2}
            y={glassHeight / 2 + 10}
            fontSize={Math.floor(glassWidth * 0.7)}
            fill="#26c6da"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {emoji ?? '💧'}
          </SvgText>

          {/* animated overlay covering the top (unfilled) portion so blue shows only at the bottom */}
          <AOverlayRect animatedProps={animatedOverlayProps as any} x={0} width={glassWidth} rx={0} fill="#ffffff" opacity={0.8} />

          {/* subtle outline on top so the emoji maintains a visible edge over the fill */}
          <SvgText
            x={glassWidth / 2}
            y={glassHeight / 2 + 10}
            fontSize={Math.floor(glassWidth * 0.7)}
            fill="none"
            stroke="#8c8c8c"
            strokeWidth={Math.max(1, Math.floor(glassWidth * 0.01))}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {emoji ?? '💧'}
          </SvgText>

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
  // emoji is rendered as SVG text inside the glass now
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
