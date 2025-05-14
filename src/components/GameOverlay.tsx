import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface GameOverlayProps {
  gameOver: boolean;
  gameWon: boolean;
  onRestart: () => void;
  onNextLevel: () => void;
}

const GameOverlay: React.FC<GameOverlayProps> = ({
  gameOver,
  gameWon,
  onRestart,
  onNextLevel,
}) => {
  if (!gameOver && !gameWon) return null;

  return (
    <View style={styles.gameOverContainer}>
      {gameWon ? (
        <>
          <Text style={styles.gameWonMessage}>Level Complete!</Text>
          <TouchableOpacity style={styles.button} onPress={onNextLevel}>
            <Text style={styles.buttonText}> Next Level</Text>
            <Text style={styles.buttonText}>Contain ads</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.gameOverMessage}>Game Over!</Text>
          <TouchableOpacity style={styles.button} onPress={onRestart}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default GameOverlay;

const styles = StyleSheet.create({
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameWonMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
  },
  gameOverMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
