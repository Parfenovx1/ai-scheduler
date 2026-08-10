import { useEffect } from "react";
import { Platform, Keyboard, KeyboardEvent } from "react-native";
import { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { KEYBOARD_ANIMATION } from "../constants/animations";

export function useKeyboardMargin(maxMargin: number = KEYBOARD_ANIMATION.extraMargin) {
  const progress = useSharedValue(0); // 0 = keyboard closed, 1 = keyboard open

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e: KeyboardEvent) => {
      const duration = e.duration || KEYBOARD_ANIMATION.defaultDuration;
      progress.value = withTiming(1, { duration, easing: KEYBOARD_ANIMATION.easing });
    });

    const hideSub = Keyboard.addListener(hideEvent, (e: KeyboardEvent) => {
      const duration = e.duration || KEYBOARD_ANIMATION.defaultDuration;
      progress.value = withTiming(0, { duration, easing: KEYBOARD_ANIMATION.easing });
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [maxMargin]);

  const animatedMarginStyle = useAnimatedStyle(() => {
    const { liftDistance, scaleRange, opacityRange } = KEYBOARD_ANIMATION;

    return {
      marginBottom: progress.value * maxMargin,
      transform: [
        { translateY: (1 - progress.value) * liftDistance },
        {
          scale:
            scaleRange.from + progress.value * (scaleRange.to - scaleRange.from),
        },
      ],
      opacity:
        opacityRange.from + progress.value * (opacityRange.to - opacityRange.from),
    };
  });

  return animatedMarginStyle;
}
