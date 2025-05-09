import { StyleSheet, Dimensions, Platform } from "react-native";

// Get device dimensions
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

// Responsive grid calculations
const BOARD_SIZE = 5;
const GRID_PADDING = 5;
const MAX_BOARD_WIDTH = Math.min(WINDOW_WIDTH - 40, 500); // Cap max board width
const CELL_SIZE = (MAX_BOARD_WIDTH - (GRID_PADDING * 2)) / BOARD_SIZE;
const CELL_MARGIN = Math.max(2, Math.min(4, CELL_SIZE * 0.06)); // Responsive margins

// Responsive font sizes
const getFontSize = (size: number) => {
  const baseWidth = 375; // iPhone X width as base
  const scaleFactor = Math.min(WINDOW_WIDTH / baseWidth, 1.3); // Cap scaling
  return Math.round(size * scaleFactor);
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8ef',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  header: {
    width: '100%',
    paddingHorizontal: Math.max(10, WINDOW_WIDTH * 0.05),
    paddingVertical: 10,
    maxWidth: 600, // Maximum width for larger screens
  },
  board: {
    width: MAX_BOARD_WIDTH,
    height: MAX_BOARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginVertical: WINDOW_HEIGHT * 0.03,
    padding: GRID_PADDING,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cellContainer: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    width: CELL_SIZE - (CELL_MARGIN * 2),
    height: CELL_SIZE - (CELL_MARGIN * 2),
    borderRadius: Math.max(3, CELL_SIZE * 0.08),
    justifyContent: 'center',
    alignItems: 'center',
    margin: CELL_MARGIN,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  cellText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFF',
    fontSize: Math.max(16, CELL_SIZE * 0.4),
  },
  title: {
    fontSize: getFontSize(28),
    fontWeight: 'bold',
    color: '#776e65',
    marginBottom: 10,
    textAlign: 'center',
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  scoreContainer: {
    backgroundColor: '#bbada0',
    padding: WINDOW_WIDTH * 0.02,
    borderRadius: 5,
    alignItems: 'center',
    minWidth: WINDOW_WIDTH * 0.2,
    margin: 2,
  },
  scoreLabel: {
    color: '#eee4da',
    fontSize: getFontSize(14),
    fontWeight: 'bold',
  },
  scoreValue: {
    color: 'white',
    fontSize: getFontSize(20),
    fontWeight: 'bold',
  },
  levelContainer: {
    backgroundColor: '#bbada0',
    padding: WINDOW_WIDTH * 0.02,
    borderRadius: 5,
    alignItems: 'center',
    minWidth: WINDOW_WIDTH * 0.25,
    margin: 2,
  },
  levelLabel: {
    color: '#eee4da',
    fontSize: getFontSize(14),
    fontWeight: 'bold',
  },
  goalLabel: {
    color: 'white',
    fontSize: getFontSize(16),
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#8f7a66',
    paddingHorizontal: WINDOW_WIDTH * 0.04,
    paddingVertical: WINDOW_HEIGHT * 0.01,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: getFontSize(16),
  },
  modeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: '#bbada0',
    padding: 8,
    borderRadius: 20,
    flexWrap: 'wrap',
  },
  modeText: {
    fontSize: getFontSize(16),
    color: '#f9f6f2',
    marginRight: 10,
  },
  selectedCell: {
    borderWidth: CELL_SIZE * 0.05,
    borderColor: '#FFF',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  completionMessage: {
    position: 'absolute',
    bottom: WINDOW_HEIGHT * 0.05,
    backgroundColor: 'rgba(121, 185, 60, 0.9)',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
    width: '80%',
    maxWidth: 400,
  },
  completionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: getFontSize(16),
    textAlign: 'center',
  },
  tutorialContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  tutorialContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  tutorialTitle: {
    fontSize: getFontSize(20),
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#776e65',
    textAlign: 'center',
  },
  tutorialText: {
    fontSize: getFontSize(16),
    color: '#776e65',
    marginBottom: 15,
    textAlign: 'center',
  },
  tutorialButton: {
    backgroundColor: '#8f7a66',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  tutorialButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: getFontSize(16),
  },
  swipePathLine: {
    position: 'absolute',
    zIndex: 5,
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(238, 228, 218, 0.73)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  gameOverMessage: {
    fontSize: getFontSize(30),
    fontWeight: 'bold',
    color: '#776e65',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  gameWonMessage: {
    fontSize: getFontSize(30),
    fontWeight: 'bold',
    color: '#f9f6f2',
    backgroundColor: '#EDC22E',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  selectionBadge: {
    position: 'absolute',
    top: -CELL_SIZE * 0.15,
    right: -CELL_SIZE * 0.15,
    backgroundColor: '#FF4081',
    width: CELL_SIZE * 0.35,
    height: CELL_SIZE * 0.35,
    borderRadius: CELL_SIZE * 0.175,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  selectionBadgeText: {
    color: '#FFF',
    fontSize: Math.max(10, CELL_SIZE * 0.2),
    fontWeight: 'bold',
  },
  swipeModeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: getFontSize(12),
  },
  swipePathContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  swipePath: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  boardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 20,
  },
  connectionLine: {
    position: 'absolute',
    zIndex: 5,
  },
  mergeEffect: {
    position: 'absolute',
    borderRadius: CELL_SIZE * 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  shimmer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  validPatternIndicator: {
    position: 'absolute',
    bottom: WINDOW_HEIGHT * 0.02,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    zIndex: 15,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    maxWidth: '90%',
  },
  validPatternText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: getFontSize(14),
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 10,
  },
  pauseButton: {
    marginTop: WINDOW_HEIGHT * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
   bannerContainer: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    backgroundColor: '#fff', // optional
    paddingBottom: 5,
  },
  
  // Media query style patterns for different device sizes
  ...Platform.select({
    ios: {
      // iOS specific adjustments if needed
      container: {
        paddingTop: 50, // Account for iOS status bar
      }
    },
    android: {
      // Android specific adjustments if needed
    },
  }),
  
  // Orientation-specific styles
  ...(WINDOW_WIDTH > WINDOW_HEIGHT ? {
    // Landscape mode
    gameInfo: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
    },
    board: {
      marginVertical: WINDOW_HEIGHT * 0.02,
    },
    controls: {
      marginTop: 10,
    }
  } : {
    // Portrait mode (default styles)
  })
});

// Listen for orientation changes and screen size updates
Dimensions.addEventListener('change', () => {
  const { width: newWidth, height: newHeight } = Dimensions.get('window');
  // You would need to trigger a re-render here in your component
  // This is just a reminder that you should handle orientation changes in your component
});