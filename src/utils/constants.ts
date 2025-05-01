import { Dimensions } from 'react-native';
import { BOARD_SIZE } from '../types';

// Game constants
export const WINDOW_WIDTH = Dimensions.get('window').width;
export const CELL_SIZE = Math.min(WINDOW_WIDTH / (BOARD_SIZE + 1), 70);
export const CELL_MARGIN = 4;
export const SWIPE_THRESHOLD = 10; 

// Tile values
export const BASE_TILE_VALUE = 2;
export const INITIAL_TILE_VALUES = [2, 4];

// Scoring and rewards
export const GEMS_MULTIPLIER = 1/8;  // Gems earned per point
export const LEVEL_COMPLETE_GEMS = 50;

// Game mechanics
export const INITIAL_GOAL = 32;
export const INITIAL_GEMS = 100;
export const INITIAL_LEVEL = 1;

// UI constants
export const TILE_SIZE = 60;
export const TILE_MARGIN = 5;
export const ANIMATION_DURATION = 300// Minimum distance for a swipe to register

// Color mapping for different tile values
export const COLORS: Record<number, string> = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e'
};

// Get text color based on tile value
export const getTextColor = (value: number): string => {
  return value <= 4 ? '#776e65' : '#f9f6f2';
};

// Get font size based on tile value
export const getFontSize = (value: number): number => {
  const numDigits = value.toString().length;
  return numDigits <= 2 ? 24 : numDigits === 3 ? 20 : 16;
};