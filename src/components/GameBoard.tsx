import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  PanResponder,
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import { useGameContext } from '../context/GameContext';
import Tile from '../components/Tile';
import { isValidSelectionPattern, areAdjacent } from '../utils/gameLogic';
import { TILE_SIZE, TILE_MARGIN } from '../utils/constants';

interface GameBoardProps {
  onReset?: () => void;
}

interface Layout {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TileData {
  row: number;
  col: number;
  value: number;
}

interface GameState {
  board: number[][];
  selectedTiles: TileData[];
  swipePath: TileData[];
  validPatternFound: boolean | null;
}

type GameAction = 
  | { type: 'CLEAR_SWIPE_PATH' }
  | { type: 'UPDATE_SWIPE_PATH'; payload: TileData }
  | { type: 'SET_VALID_PATTERN'; payload: boolean | null }
  | { type: 'SET_SELECTED_TILES'; payload: TileData[] }
  | { type: 'CONFIRM_CONNECTION' };

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameBoard: React.FC<GameBoardProps> = ({ onReset }) => {
  const { state, dispatch } = useGameContext() as GameContextType;
  const { board, selectedTiles, swipePath, validPatternFound } = state;

  const [layout, setLayout] = useState<Layout | null>(null);
  const boardRef = useRef<View | null>(null);
  const touchActive = useRef<boolean>(false);
  const pathOpacity = useRef(new Animated.Value(0)).current;
  const swipePathRef = useRef<TileData[]>([]);

  // Sync swipePath ref with state
  useEffect(() => {
    swipePathRef.current = swipePath;
  }, [swipePath]);

  useEffect(() => {
    if (validPatternFound) {
      Animated.timing(pathOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      pathOpacity.setValue(0);
    }
  }, [validPatternFound, pathOpacity]);

  const getTilePosition = (row: number, col: number): { centerX: number; centerY: number } => {
    const centerX = col * (TILE_SIZE + TILE_MARGIN * 2) + TILE_SIZE / 2;
    const centerY = row * (TILE_SIZE + TILE_MARGIN * 2) + TILE_SIZE / 2;
    return { centerX, centerY };
  };

  const getTilePositionFromTouch = (touchX: number, touchY: number): { row: number; col: number } | null => {
    if (!layout) return null;
    const localX = touchX - layout.x;
    const localY = touchY - layout.y;
    const col = Math.floor(localX / (TILE_SIZE + TILE_MARGIN * 2));
    const row = Math.floor(localY / (TILE_SIZE + TILE_MARGIN * 2));
    if (
      row >= 0 &&
      row < board.length &&
      col >= 0 &&
      col < board[0].length
    ) {
      return { row, col };
    }
    return null;
  };

  const handleBoardLayout = (e: LayoutChangeEvent): void => {
    const { x, y, width, height } = e.nativeEvent.layout;
    setLayout({ x, y, width, height });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (): boolean => true,
    onMoveShouldSetPanResponder: (): boolean => true,

    onPanResponderGrant: (_: GestureResponderEvent, gestureState: PanResponderGestureState): void => {
      if (!layout) return;
      touchActive.current = true;

      dispatch({ type: 'CLEAR_SWIPE_PATH' });
      dispatch({ type: 'SET_VALID_PATTERN', payload: null });

      const position = getTilePositionFromTouch(gestureState.x0, gestureState.y0);
      if (position) {
        const { row, col } = position;
        const value = board[row][col];
        const tile = { row, col, value };
        dispatch({ type: 'UPDATE_SWIPE_PATH', payload: tile });
        swipePathRef.current = [tile];
      }
    },

    onPanResponderMove: (_: GestureResponderEvent, gestureState: PanResponderGestureState): void => {
      if (!touchActive.current || swipePathRef.current.length === 0 || !layout) return;

      const position = getTilePositionFromTouch(gestureState.moveX, gestureState.moveY);
      if (!position) return;

      const { row, col } = position;
      const pathSoFar = swipePathRef.current;
      const lastTile = pathSoFar[pathSoFar.length - 1];

      if (lastTile.row === row && lastTile.col === col) return;

      const alreadyInPath = pathSoFar.some(t => t.row === row && t.col === col);
      if (alreadyInPath) return;

      const currentTile: TileData = { row, col, value: board[row][col] };
      if (areAdjacent(lastTile, currentTile)) {
        dispatch({ type: 'UPDATE_SWIPE_PATH', payload: currentTile });
        const newPath = [...pathSoFar, currentTile];
        swipePathRef.current = newPath;

        const isValid = isValidSelectionPattern(newPath);
        dispatch({ type: 'SET_VALID_PATTERN', payload: isValid });
      }
    },

    onPanResponderRelease: (): void => {
      touchActive.current = false;

      if (validPatternFound && swipePath.length >= 2) {
        dispatch({ type: 'SET_SELECTED_TILES', payload: swipePath });
        setTimeout(() => {
          dispatch({ type: 'CONFIRM_CONNECTION' });
        }, 300);
      } else {
        dispatch({ type: 'CLEAR_SWIPE_PATH' });
        dispatch({ type: 'SET_VALID_PATTERN', payload: null });
      }
    },

    onPanResponderTerminate: (): void => {
      touchActive.current = false;
      dispatch({ type: 'CLEAR_SWIPE_PATH' });
      dispatch({ type: 'SET_VALID_PATTERN', payload: null });
    },
  });

  const renderConnectionLines = (): React.ReactNode => {
    if (swipePath.length < 2) return null;
    return swipePath.map((tile, index) => {
      if (index === 0) return null;
      const prevTile = swipePath[index - 1];
      const { centerX: startX, centerY: startY } = getTilePosition(prevTile.row, prevTile.col);
      const { centerX: endX, centerY: endY } = getTilePosition(tile.row, tile.col);
      const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
      const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      return (
        <Animated.View
          key={`line-${index}`}
          style={[
        gameStyles.line,
        {
          left: startX,
          top: startY,
          width: distance,
          transform: [
            { translateY: -2 },
            { rotate: `${angle}deg` },
          ],
          opacity: pathOpacity,
          backgroundColor: validPatternFound === false ? 'rgba(187, 24, 24, 0.7)' : 'rgba(0, 150, 255, 0.7)'
        }
          ]}
        />
      );
    });
  };

  const renderResetButton = (): React.ReactNode => {
    if (!onReset) return null;
    return (
      <TouchableOpacity
        style={gameStyles.resetButton}
        onPress={() => {
          dispatch({ type: 'CLEAR_SWIPE_PATH' });
          dispatch({ type: 'SET_VALID_PATTERN', payload: null });
          if (onReset) onReset();
        }}
      >
        <Text style={gameStyles.resetButtonText}>Reset Board</Text>
      </TouchableOpacity>
    );
  };

  const DEBUG = true;
  const renderDebugInfo = (): React.ReactNode => {
    if (!DEBUG) return null;
    return (
      <View style={gameStyles.debugContainer}>
        <Text style={gameStyles.debugText}>
          Selected Tiles: {selectedTiles.length}{'\n'}
          Swipe Path: {swipePath.length}{'\n'}
          Valid Pattern: {validPatternFound ? 'YES' : 'NO'}
        </Text>
      </View>
    );
  };

  return (
    <View style={gameStyles.container}>
      {renderDebugInfo()}
      <View
        style={gameStyles.boardContainer}
        {...panResponder.panHandlers}
        ref={boardRef}
        onLayout={handleBoardLayout}
      >
        {board.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={gameStyles.row}>
            {row.map((value, colIndex) => (
              <Tile
                key={`tile-${rowIndex}-${colIndex}`}
                value={value}
                row={rowIndex}
                col={colIndex}
                isSelected={selectedTiles.some(tile => tile.row === rowIndex && tile.col === colIndex)}
                inCurrentPath={swipePath.some(tile => tile.row === rowIndex && tile.col === colIndex)}
              />
            ))}
          </View>
        ))}
        {renderConnectionLines()}
      </View>
      <View style={gameStyles.controlContainer}>
        {renderResetButton()}
      </View>
    </View>
  );
};

const gameStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
  },
  line: {
    height: 4,
    position: 'absolute',
    borderRadius: 2,
    zIndex: 1,
    transformOrigin: 'left',
  },
  controlContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  debugContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
    zIndex: 100,
  },
  debugText: {
    color: 'white',
    fontFamily: 'monospace',
  },
});

export default GameBoard;
