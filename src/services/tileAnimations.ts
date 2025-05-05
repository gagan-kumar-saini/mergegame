 // tileAnimations.ts
 import { BOARD_SIZE } from '../utils/Constants';
import { Animated } from 'react-native';

export function createTileAnimations(boardSize: number = BOARD_SIZE) {
  return Array(boardSize).fill(0).map(() =>
    Array(boardSize).fill(0).map(() => ({
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
    }))
  );
}
