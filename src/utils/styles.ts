import { StyleSheet } from 'react-native';
import { CELL_SIZE, CELL_MARGIN } from './constants';

// Common styles that can be shared across components
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8ef',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
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
  row: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#bbada0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cardLabel: {
    color: '#eee4da',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Overlay styles
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  // Message styles
  message: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  // Board general styles
  board: {
    backgroundColor: '#bbada0',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cellContainer: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: CELL_MARGIN,
    borderRadius: 5,
    overflow: 'hidden',
  },
});