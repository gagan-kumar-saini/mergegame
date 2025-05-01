export interface GestureState {
    isActive: boolean;
    startX: number;
    startY: number;
    lastTile: TilePosition | null;
  }
  
  export interface TilePosition {
    row: number;
    col: number;
    value: number;
  }
  
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
    swipePath: { x: number; y: number }[];
    validPatternFound: boolean | null;
  }
  