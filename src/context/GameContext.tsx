import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { GameState, GameAction, TilePosition } from '../types';
import { generateNewBoard, isValidSelectionPattern, areAdjacent, checkForGameOver, fillEmptySpaces } from '../utils/gameLogic';

// Initial game state
const initialGameState: GameState = {
  board: Array(5).fill(0).map(() => Array(5).fill(2)),
  score: 0,
  bestScore: 0,
  gems: 100,
  level: 1,
  goal: 32,
  highestValue: 2,
  selectedTiles: [],
  gameOver: false,
  gameWon: false,
  animationInProgress: false,
  swipeMode: false,
  showTutorial: true,
  swipePath: [],
  validPatternFound: null
};

// Create context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Game reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INITIALIZE_BOARD':
      return {
        ...state,
        board: generateNewBoard(state.level),
        score: 0,
        selectedTiles: [],
        gameOver: false,
        gameWon: false,
        swipePath: [],
        validPatternFound: null
      };
      
    case 'SET_SELECTED_TILES':
      return {
        ...state,
        selectedTiles: action.payload
      };
      
    case 'ADD_TILE_TO_SELECTION': {
      const tile = action.payload;
      const { selectedTiles } = state;
      
      // If no tiles selected yet, add this one
      if (selectedTiles.length === 0) {
        return {
          ...state,
          selectedTiles: [tile]
        };
      }
      
      // Get the last selected tile
      const lastSelected = selectedTiles[selectedTiles.length - 1];
      
      // Check if this tile is already selected
      const isAlreadySelected = selectedTiles.some(
        t => t.row === tile.row && t.col === tile.col
      );
      
      // If already selected and it's the last one, ignore
      if (isAlreadySelected && 
          lastSelected.row === tile.row && 
          lastSelected.col === tile.col) {
        return state;
      }
      
      // If not adjacent to last selected tile, ignore
      if (!areAdjacent(lastSelected, tile)) {
        return state;
      }
      
      // Logic for connecting tiles based on values
      // For same values, always allow connection
      if (lastSelected.value === tile.value) {
        return {
          ...state,
          selectedTiles: [...selectedTiles, tile]
        };
      } 
      // For pattern of same values followed by double value
      else if (selectedTiles.length >= 2) {
        const prevTile = selectedTiles[selectedTiles.length - 2];
        
        if (prevTile.value === lastSelected.value && tile.value === lastSelected.value * 2) {
          return {
            ...state,
            selectedTiles: [...selectedTiles, tile]
          };
        }
      }
      
      // Not a valid connection
      return state;
    }
      
    case 'CONFIRM_CONNECTION': {
      const { selectedTiles } = state;
      
      if (selectedTiles.length < 2) return state;
      
      // Check if selection is valid
      if (!isValidSelectionPattern(selectedTiles)) {
        return {
          ...state,
          selectedTiles: []
        };
      }
      
      // Calculate points - base value is last tile value
      const pointsEarned = selectedTiles[selectedTiles.length - 1].value;
      
      // Create a copy of the board
      const newBoard = state.board.map(row => [...row]);
      
      // Mark tiles as removed (set to 0) except the last one
      selectedTiles.slice(0, -1).forEach(tile => {
        newBoard[tile.row][tile.col] = 0;
      });
      
      // Set last tile to its new value
      const lastTile = selectedTiles[selectedTiles.length - 1];
      newBoard[lastTile.row][lastTile.col] *= 2;
      
      // Fill empty spaces with new tiles
      const filledBoard = fillEmptySpaces(newBoard, state.level);
      
      // Calculate new score
      const newScore = state.score + pointsEarned;
      const newBestScore = Math.max(state.bestScore, newScore);
      
      // Get highest value on board
      const highestValue = Math.max(...filledBoard.flat());
      
      // Check win condition
      const gameWon = highestValue >= state.goal;
      
      // Check if there are any valid moves left
      const gameOver = !gameWon && checkForGameOver(filledBoard);
      
      // Update gems
      const updatedGems = state.gems + Math.floor(pointsEarned / 8);
      
      return {
        ...state,
        board: filledBoard,
        score: newScore,
        bestScore: newBestScore,
        highestValue,
        selectedTiles: [],
        gameWon,
        gameOver,
        validPatternFound: null,
        gems: updatedGems,
        swipePath: []
      };
    }
      
    case 'TOGGLE_SWIPE_MODE':
      return {
        ...state,
        swipeMode: !state.swipeMode,
        selectedTiles: [], // Clear selection when toggling modes
        showTutorial: !state.swipeMode && !state.showTutorial ? true : state.showTutorial
      };
      
    case 'CLOSE_TUTORIAL':
      return {
        ...state,
        showTutorial: false
      };
      
    case 'UPDATE_SWIPE_PATH':
      return {
        ...state,
        swipePath: [...state.swipePath, action.payload]
      };
      
    case 'SET_VALID_PATTERN':
      return {
        ...state,
        validPatternFound: action.payload
      };
      
    case 'CLEAR_SWIPE_PATH':
      return {
        ...state,
        swipePath: [],
        validPatternFound: null
      };
      
    case 'PROGRESS_TO_NEXT_LEVEL':
      return {
        ...state,
        level: state.level + 1,
        goal: state.goal * 2,
        gameWon: false,
        gems: state.gems + 50 // Reward for completing level
      };
      
    default:
      return state;
  }
}

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  
  // Initialize board on mount
  useEffect(() => {
    dispatch({ type: 'INITIALIZE_BOARD' });
    
    // Load best score from storage if available
    const loadBestScore = async () => {
      try {
        // For React Native, you would typically use AsyncStorage here
        // const storedBestScore = await AsyncStorage.getItem('bestScore');
        // if (storedBestScore) {
        //   setGameState(prev => ({
        //     ...prev,
        //     bestScore: parseInt(storedBestScore, 10)
        //   }));
        // }
      } catch (error) {
        console.error('Failed to load best score:', error);
      }
    };
    
    loadBestScore();
  }, []);
  
  // Save best score when it changes
  useEffect(() => {
    if (state.bestScore > 0) {
      try {
        // For React Native, you would typically use AsyncStorage here
        // AsyncStorage.setItem('bestScore', state.bestScore.toString());
      } catch (error) {
        console.error('Failed to save best score:', error);
      }
    }
  }, [state.bestScore]);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for using the game context
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};