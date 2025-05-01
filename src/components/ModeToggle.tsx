import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { styles } from '../utils/Styles';

interface ModeToggleProps {
  swipeMode: boolean;
  onToggle: (value: boolean) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ swipeMode, onToggle }) => {
  return (
    <View style={styles.modeToggleContainer}>
      <Text style={styles.modeText}>
        {swipeMode ? "Swipe Mode" : "Tap Mode"}
      </Text>
      <Switch
        value={swipeMode}
        onValueChange={onToggle}
        trackColor={{ false: '#bbada0', true: '#4CAF50' }}
      />
    </View>
  );
};

export default ModeToggle;

