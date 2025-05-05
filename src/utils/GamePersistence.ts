import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState } from '../types/GameTypes';

// Keys for storing game data
const GAME_STATE_KEY = '@PowerMerge:gameState';

// Save the entire game state to AsyncStorage
export const saveGameState = async (gameState: GameState): Promise<void> => {
  try {
    const gameStateToSave = {
      ...gameState,
      // Remove properties we don't need to save
      animationInProgress: false,
      swipePath: [],
      validPatternFound: null
    };
    
    await AsyncStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameStateToSave));
    console.log('Game state saved successfully');
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

// Load the game state from AsyncStorage
export const loadGameState = async (): Promise<GameState | null> => {
  try {
    const savedGameState = await AsyncStorage.getItem(GAME_STATE_KEY);
    
    if (savedGameState) {
      console.log('Game state loaded successfully');
      return JSON.parse(savedGameState);
    }
    
    return null;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
};

// Clear the saved game state (useful for debugging or resets)
export const clearGameState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(GAME_STATE_KEY);
    console.log('Game state cleared successfully');
  } catch (error) {
    console.error('Error clearing game state:', error);
  }
};