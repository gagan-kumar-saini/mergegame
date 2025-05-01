import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface GameControlsProps {
  onNewGame: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onNewGame }) => {
  return (
    <View style={styles.controls}>
      <TouchableOpacity style={styles.button} onPress={onNewGame}>
        <Text style={styles.buttonText}>New Game</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GameControls;

const styles = StyleSheet.create({
  controls: {
    marginTop: 16,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
