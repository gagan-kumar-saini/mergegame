import { StyleSheet,Dimensions } from "react-native";

const BOARD_SIZE = 5;
const WINDOW_WIDTH = Dimensions.get('window').width;
const CELL_SIZE = Math.min(WINDOW_WIDTH / (BOARD_SIZE + 1), 70);
const CELL_MARGIN = 4;

 export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8ef',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#776e65',
    marginBottom: 10,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  scoreContainer: {
    backgroundColor: '#bbada0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    minWidth: 80,
  },
  scoreLabel: {
    color: '#eee4da',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scoreValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  levelContainer: {
    backgroundColor: '#bbada0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    minWidth: 100,
  },
  levelLabel: {
    color: '#eee4da',
    fontSize: 14,
    fontWeight: 'bold',
  },
  goalLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  board: {
    backgroundColor: '#bbada0',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
  },
  cellContainer: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: CELL_MARGIN,
    borderRadius: 5,
    overflow: 'hidden',
  },
  cell: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontWeight: 'bold',
  },
  selectedCell: {
    borderWidth: 3,
    borderColor: '#4CAF50',
    transform: [{ scale: 1.5 }]
  },
  selectionBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: '#4CAF50',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#8f7a66',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: '#bbada0',
    padding: 8,
    borderRadius: 20,
  },
  modeText: {
    fontSize: 16,
    color: '#f9f6f2',
    marginRight: 10,
  },
  swipeModeIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  swipeModeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#776e65',
  },
  completionMessage: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(121, 185, 60, 0.9)',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  completionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
    width: '80%',
    alignItems: 'center',
  },
  tutorialTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#776e65',
  },
  tutorialText: {
    fontSize: 16,
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
  },
  swipePathLine: {
    position: 'absolute',
    // backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#776e65',
    marginBottom: 20,
  },
  gameWonMessage: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#f9f6f2',
    backgroundColor: '#EDC22E',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  }
}
);