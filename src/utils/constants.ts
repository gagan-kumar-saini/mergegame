import { Dimensions } from "react-native";

export const BOARD_SIZE = 5;
export const WINDOW_WIDTH = Dimensions.get('window').width;
export const CELL_SIZE = Math.min(WINDOW_WIDTH / (BOARD_SIZE + 1), 70);
export const CELL_MARGIN = 4;
export const SWIPE_THRESHOLD = 10;

export const COLORS: Record<number, string> = {
    2: '#28D51F',
    4: '#FFDB00',
    8: '#0090D9',
    16: '#FE3F47',
    32: '#FF6300',
    64: '#00C368',
    128: '#142CF1',
    256: '#97196F',
    512: '#7BC09B',
    1024: '#9360A4',
    2048: '#2BD4D1'
  };