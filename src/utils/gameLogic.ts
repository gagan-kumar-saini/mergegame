import { TilePosition } from '../types';
import { BOARD_SIZE } from '../types';

// Check if two positions are adjacent
export const areAdjacent = (pos1: TilePosition, pos2: TilePosition): boolean => {
  return (
    (Math.abs(pos1.row - pos2.row) === 0 && Math.abs(pos1.col - pos2.col) === 1) ||
    (Math.abs(pos1.row - pos2.row) === 1 && Math.abs(pos1.col - pos2.col) === 0) ||
    (Math.abs(pos1.row - pos2.row) === 1 && Math.abs(pos1.col - pos2.col) === 1)
  );
};

// Check if a selection pattern is valid
export const isValidSelectionPattern = (tiles: TilePosition[]): boolean => {
  if (tiles.length < 3) return tiles.length === 2 && tiles[0].value === tiles[1].value;

  let i = 0;
  while (i <= tiles.length - 3) {
    const [a, b, c] = [tiles[i], tiles[i + 1], tiles[i + 2]];

    if (a.value === b.value && c.value === a.value * 2) {
      i += 3;
    } else {
      return false;
    }
  }

  // Make sure all tiles are consumed correctly
  return i === tiles.length;
};


// Check if any valid moves are available
export const checkForGameOver = (board: number[][]): boolean => {
  // Check each cell for potential matches
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const currentValue = board[row][col];
      
      // Check neighbors (right, down, diagonal)
      const neighbors = [
        { r: row, c: col + 1 }, // right
        { r: row + 1, c: col }, // down
        { r: row + 1, c: col + 1 }, // diagonal down-right
        { r: row - 1, c: col + 1 }, // diagonal up-right
      ];
      
      for (const neighbor of neighbors) {
        const { r, c } = neighbor;
        
        // Skip if out of bounds
        if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) continue;
        
        const neighborValue = board[r][c];
        
        // Check for matching values (same value pairs)
        if (currentValue === neighborValue) {
          return false; // Found a valid move
        }
        
        // Check for valid pattern: 2,2,4 or similar
        if (row < BOARD_SIZE - 2 && col < BOARD_SIZE - 1) {
          // Check horizontal pattern (x,x,2x)
          if (board[row][col] === board[row][col+1] && 
              board[row+1][col] === board[row][col] * 2) {
            return false; // Found a valid move
          }
        }
        
        if (row < BOARD_SIZE - 1 && col < BOARD_SIZE - 2) {
          // Check vertical pattern (x,x,2x)
          if (board[row][col] === board[row+1][col] && 
              board[row][col+1] === board[row][col] * 2) {
            return false; // Found a valid move
          }
        }
      }
    }
  }
  
  return true; // No valid moves found
};

// Generate a new board
export const generateNewBoard = (level: number): number[][] => {
  const maxTileValue = 2 ** (level + 1); // Increase upper value as level increases
  
  // Create initial board with some random values
  return Array(BOARD_SIZE).fill(0).map(() => 
    Array(BOARD_SIZE).fill(0).map(() => 
      Math.random() < 0.8 ? 2 : Math.min(maxTileValue, 4)
    )
  );
};

// Fill empty spaces with new tiles
export const fillEmptySpaces = (board: number[][], level: number): number[][] => {
  const newBoard = [...board.map(row => [...row])];
  const maxTileValue = 2 ** (level + 1); // Increase upper value as level increases
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (newBoard[row][col] === 0) {
        const randomValue = Math.random();
        newBoard[row][col] = randomValue < 0.8 ? 2 : Math.min(maxTileValue, 4);
      }
    }
  }
  
  return newBoard;
};

// Function to get tile at position
export const getTileAtPosition = (
  x: number, 
  y: number, 
  board: number[][]
): TilePosition | null => {
  // Import CELL_SIZE and CELL_MARGIN from constants, but avoiding circular dependencies
  const CELL_SIZE = Math.min(Dimensions.get('window').width / (BOARD_SIZE + 1), 70);
  const CELL_MARGIN = 4;
  
  // Convert screen coordinates to board position
  const boardX = Math.floor(x / (CELL_SIZE + CELL_MARGIN * 2));
  const boardY = Math.floor(y / (CELL_SIZE + CELL_MARGIN * 2));
  
  // Check if position is within board
  if (boardX >= 0 && boardX < BOARD_SIZE && boardY >= 0 && boardY < BOARD_SIZE) {
    return {
      row: boardY,
      col: boardX,
      value: board[boardY][boardX]
    };
  }
  return null;
};

// Need to import Dimensions here to avoid circular dependency
import { Dimensions } from 'react-native';