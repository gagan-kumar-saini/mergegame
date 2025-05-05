 // tileAnimations.ts
import { Animated } from 'react-native';

const BOARD_SIZE = 5; // Replace with actual value if needed

export function createTileAnimations(boardSize: number = BOARD_SIZE) {
  return Array(boardSize).fill(0).map(() =>
    Array(boardSize).fill(0).map(() => ({
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
    }))
  );
}
