import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TutorialOverlayProps {
  visible: boolean;
  swipeMode: boolean;
  onClose: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ visible, swipeMode, onClose }) => {
  if (!visible || !swipeMode) return null;

  return (
    <View style={styles.tutorialContainer}>
      <View style={styles.tutorialContent}>
        <Text style={styles.tutorialTitle}>Swipe Mode Tutorial</Text>
        <Text style={styles.tutorialText}>
          Swipe your finger across tiles to select them in sequence.
        </Text>
        <Text style={styles.tutorialText}>
          Valid patterns:
          {'\n'}- Two tiles of the same value
          {'\n'}- Two pairs that create a double (2,2,4)
        </Text>
        <TouchableOpacity style={styles.tutorialButton} onPress={onClose}>
          <Text style={styles.tutorialButtonText}>Got it!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TutorialOverlay;

const styles = StyleSheet.create({
  tutorialContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  tutorialContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  tutorialTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tutorialText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  tutorialButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  tutorialButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
