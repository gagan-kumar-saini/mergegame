import { Dimensions } from "react-native";

export const BOARD_SIZE = 5;
export const WINDOW_WIDTH = Dimensions.get('window').width;
export const CELL_SIZE = Math.min(WINDOW_WIDTH / (BOARD_SIZE + 1), 70);
export const CELL_MARGIN = 4;
export const SWIPE_THRESHOLD = 10;

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