// Game constants
export const BOARD_SIZE = 5;

// Interface for tracking tile positions during swipes
export interface TilePosition {
  row: number;
  col: number;
  value: number;
}

// Interface for tracking gesture state
export interface GestureState {
  isActive: boolean;
  startX: number;
  startY: number;
  lastTile: TilePosition | null;
}

// Comprehensive GameState interface
export interface GameState {
  board: number[][];
  score: number;
  bestScore: number;
  gems: number;
  level: number;
  goal: number;
  highestValue: number;
  selectedTiles: TilePosition[];
  gameOver: boolean;
  gameWon: boolean;
  animationInProgress: boolean;
  swipeMode: boolean;
  showTutorial: boolean;
  swipePath: { x: number, y: number }[];
  validPatternFound: boolean | null;
}

// Actions for the game reducer
export type GameAction =
  | { type: 'INITIALIZE_BOARD' }
  | { type: 'SET_SELECTED_TILES', payload: TilePosition[] }
  | { type: 'ADD_TILE_TO_SELECTION', payload: TilePosition }
  | { type: 'CONFIRM_CONNECTION' }
  | { type: 'TOGGLE_SWIPE_MODE' }
  | { type: 'CLOSE_TUTORIAL' }
  | { type: 'UPDATE_SWIPE_PATH', payload: { x: number, y: number } }
  | { type: 'SET_VALID_PATTERN', payload: boolean | null }
  | { type: 'CLEAR_SWIPE_PATH' }
  | { type: 'PROGRESS_TO_NEXT_LEVEL' };

  export type ActionType =
  | "INITIALIZE_BOARD"
  | "SET_SELECTED_TILES"
  | "ADD_TILE_TO_SELECTION"
  | "CONFIRM_CONNECTION"
  | "TOGGLE_SWIPE_MODE"
  | "CLOSE_TUTORIAL"
  | "UPDATE_SWIPE_PATH"
  | "SET_VALID_PATTERN"
  | "CLEAR_SWIPE_PATH"
  | "PROGRESS_TO_NEXT_LEVEL"
  | "TOGGLE_TUTORIAL";
