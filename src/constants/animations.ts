import { Easing } from "react-native-reanimated";

export const KEYBOARD_ANIMATION = {
  extraMargin: 10,
  defaultDuration: 250,
  easing: Easing.out(Easing.ease),
  liftDistance: 4,
  scaleRange: { from: 0.98, to: 1 },
  opacityRange: { from: 0.9, to: 1 },
} as const;