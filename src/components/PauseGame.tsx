import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ViewStyle, TextStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Make sure to install this package

// Theme type definition
interface PauseMenuTheme {
  headerColor: string;
  headerTextColor: string;
  closeButtonColor: string;
  contentBackgroundColor: string;
  textColor: string;
  scoreValueColor: string;
  circleButtonColors: [string, string]; // [startColor, endColor]
  playButtonColors: [string, string]; // [startColor, endColor]
}

// Default theme
const defaultTheme: PauseMenuTheme = {
  headerColor: '#4CAF50', // Green
  headerTextColor: 'white',
  closeButtonColor: '#F44336', // Red
  contentBackgroundColor: '#D7CCA1', // Light brown / amber
  textColor: '#333',
  scoreValueColor: '#4CAF50', // Green
  circleButtonColors: ['#FF6B6B', '#F44336'], // Red gradient
  playButtonColors: ['#FFA726', '#FB8C00'], // Orange gradient
};

// Props interface
interface PauseMenuProps {
  score?: number;
  onClose?: () => void;
  onHome?: () => void;
  onRestart?: () => void;
  onPlay?: () => void;
  theme?: Partial<PauseMenuTheme>;
  containerStyle?: ViewStyle;
  messageText?: string;
  pauseText?: string;
  playText?: string;
}

// Component
const PauseMenu: React.FC<PauseMenuProps> = ({
  score = 4096,
  onClose = () => {},
  onHome = () => {},
  onRestart = () => {},
  onPlay = () => {},
  theme = {},
  containerStyle = {},
  messageText = "Take a breather. Your progress is safe.",
  pauseText = "PAUSE",
  playText = "Play",
}) => {
 
  
  
  
  return (
    <View style={styles.overlay}>

    </View>
  );
};

// Base styles that don't change with theme
const { width } = Dimensions.get('window');
const containerWidth = Math.min(width * 0.8, 280);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: containerWidth,
    alignItems: 'center',
  },
  ribbonContainer: {
    width: '100%',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    width: '100%',
  },
  circleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  circleButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonOuter: {
    width: 160,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  playButtonInner: {
    width: 160,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default PauseMenu;