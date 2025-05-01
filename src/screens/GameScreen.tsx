import React from 'react';
import { View, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { useGameContext } from '../context/GameContext';
import GameBoard from '../components/GameBoard';
import Header from '../components/Header';
import { StyleSheet } from 'react-native';

const GameScreen: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { selectedTiles, swipeMode } = state;
  
  // Handler for resetting the game
  const handleReset = () => {
    dispatch({ type: 'INITIALIZE_BOARD' });
  };
  
  // Handler for confirming the current selection
  const handleConfirmSelection = () => {
    if (selectedTiles.length >= 2) {
      dispatch({ type: 'CONFIRM_CONNECTION' });
    }
  };
  
  // Handler for clearing the current selection
  const handleClearSelection = () => {
    dispatch({ type: 'SET_SELECTED_TILES', payload: [] });
  };
  
  // Render game controls
  const renderControls = () => {
    if (swipeMode || selectedTiles.length === 0) return null;
    
    return (
      <View style={gameStyles.buttonRow}>
        <TouchableOpacity
          style={gameStyles.button}
          onPress={handleConfirmSelection}
        >
          <Text style={gameStyles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={gameStyles.button}
          onPress={handleClearSelection}
        >
          <Text style={gameStyles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  // Render instructions
  const renderInstructions = () => {
    return (
      <View style={gameStyles.instructionsContainer}>
        <Text style={gameStyles.instructionsTitle}>How to Play:</Text>
        <Text style={gameStyles.instructionsText}>
          1. Connect tiles with the same value to merge them.
        </Text>
        <Text style={gameStyles.instructionsText}>
          2. Create chains of the same number, ending with a tile of double value.
        </Text>
        <Text style={gameStyles.instructionsText}>
          3. Reach the target number to complete the level.
        </Text>
        
        <View style={gameStyles.buttonRow}>
          <TouchableOpacity
            style={gameStyles.button}
            onPress={() => dispatch({ type: 'CLOSE_TUTORIAL' })}
          >
            <Text style={gameStyles.buttonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={gameStyles.container}>
    
        {/* Game header with scores and controls */}
        <Header onReset={handleReset} />
        
        {/* Game board */}
        <GameBoard onReset={handleReset} />
        
        {/* Game controls */}
        {renderControls()}
      
    </SafeAreaView>
  );
};


export const gameStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 16, // Optional, or use marginHorizontal in buttons
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 8,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 20,
    borderRadius: 10,
    width: '90%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  instructionsText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
});


export default GameScreen;