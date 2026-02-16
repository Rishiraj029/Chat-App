import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type AnimatedOrbProps = {
  colors: [string, string, ...string[]];
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
};

export function AnimatedOrb({ colors, size, initialX, initialY }: AnimatedOrbProps) {
  return (
    <View
      style={{
        position: "absolute",
        left: initialX,
        top: initialY,
      }}
    >
      <LinearGradient
        colors={colors}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: 0.5,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </View>
  );
}