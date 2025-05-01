import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
  StatusBar,
  PanResponder,
  Switch,
  GestureResponderEvent,
  PanResponderGestureState
} from 'react-native';
import { styles } from './utils/Styles'
import { BOARD_SIZE, CELL_SIZE, CELL_MARGIN, SWIPE_THRESHOLD, COLORS } from './utils/Constants'
import { getTextColor, getFontSize } from './utils/Utils'
import { GameState, GestureState, TilePosition } from './types/GameTypes'
import TutorialOverlay from './components/TutorialOverlay';
import GameInfo from './components/GameInfo';
import ModeToggle from './components/ModeToggle';
import CompletionMessage from './components/CompletionMessage';
import GameOverlay from './components/GameOverlay';
import GameControls from './components/NewGame';

export default function App() {
  // Initialize game state
  const [gameState, setGameState] = useState<GameState>({
    board: Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(2)),
    score: 0,
    bestScore: 0,
    gems: 500,
    level: 1,
    goal: 32,
    highestValue: 2,
    selectedTiles: [],
    gameOver: false,
    gameWon: false,
    animationInProgress: false,
    swipeMode: false,
    showTutorial: true,
    swipePath: [],
    validPatternFound: null
  });

  // Animation value for valid pattern indicator
  const validPatternAnim = useRef(new Animated.Value(0)).current;

  // Ref to keep track of gesture state
  const gestureStateRef = useRef<GestureState>({
    isActive: false,
    startX: 0,
    startY: 0,
    lastTile: null
  });

  // Ref to get board position for accurate gesture tracking
  const boardRef = useRef<View>(null);
  const [boardPosition, setBoardPosition] = useState({ x: 0, y: 0 });

  // Measure board position when component mounts
  useEffect(() => {
    if (boardRef.current) {
      boardRef.current.measure((x, y, width, height, pageX, pageY) => {
        setBoardPosition({ x: pageX, y: pageY });
      });
    }
  }, []);

  // Initialize board on component mount
  useEffect(() => {
    initializeBoard();

    // Load best score from storage if available
    const loadBestScore = async () => {
      try {
        // For React Native, you would typically use AsyncStorage here
        // const storedBestScore = await AsyncStorage.getItem('bestScore');
        // if (storedBestScore) {
        //   setGameState(prev => ({
        //     ...prev,
        //     bestScore: parseInt(storedBestScore, 10)
        //   }));
        // }
      } catch (error) {
        console.error('Failed to load best score:', error);
      }
    };

    loadBestScore();
  }, []);

  // Initialize the game board
  const initializeBoard = useCallback(() => {
    // Create initial board with some random values
    const newBoard = Array(BOARD_SIZE).fill(0).map(() =>
      Array(BOARD_SIZE).fill(0).map(() =>
        Math.random() < 0.8 ? 2 : 4
      )
    );

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      score: 0,
      selectedTiles: [],
      gameOver: false,
      gameWon: false
    }));
  }, []);

  // Function to get tile at position
  const getTileAtPosition = useCallback((x: number, y: number): TilePosition | null => {
    // Calculate position relative to the board
    const relativeX = x - boardPosition.x;
    const relativeY = y - boardPosition.y;
    
    // Convert screen coordinates to board position
    const boardX = Math.floor(relativeX / (CELL_SIZE + CELL_MARGIN * 2));
    const boardY = Math.floor(relativeY / (CELL_SIZE + CELL_MARGIN * 2));

    // Check if position is within board
    if (boardX >= 0 && boardX < BOARD_SIZE && boardY >= 0 && boardY < BOARD_SIZE) {
      return {
        row: boardY,
        col: boardX,
        value: gameState.board[boardY][boardX]
      };
    }
    return null;
  }, [gameState.board, boardPosition]);

  // Check if two positions are adjacent
  const areAdjacent = useCallback((pos1: TilePosition, pos2: TilePosition): boolean => {
    return (
      (Math.abs(pos1.row - pos2.row) === 0 && Math.abs(pos1.col - pos2.col) === 1) ||
      (Math.abs(pos1.row - pos2.row) === 1 && Math.abs(pos1.col - pos2.col) === 0) ||
      (Math.abs(pos1.row - pos2.row) === 1 && Math.abs(pos1.col - pos2.col) === 1)
    );
  }, []);

  // Add a tile to the selection using swipe
  const addTileToSelection = useCallback((tile: TilePosition): void => {
    if (!tile) return;

    setGameState(prev => {
      const { selectedTiles } = prev;

      // If no tiles selected yet, add this one
      if (selectedTiles.length === 0) {
        return {
          ...prev,
          selectedTiles: [tile]
        };
      }

      // Get the last selected tile
      const lastSelected = selectedTiles[selectedTiles.length - 1];

      // Check if this tile is already selected
      const isAlreadySelected = selectedTiles.some(
        t => t.row === tile.row && t.col === tile.col
      );

      // If already selected and it's the last one, ignore
      if (isAlreadySelected &&
        lastSelected.row === tile.row &&
        lastSelected.col === tile.col) {
        return prev;
      }

      // If not adjacent to last selected tile, ignore
      if (!areAdjacent(lastSelected, tile)) {
        return prev;
      }

      // Logic for connecting tiles based on values
      // For same values, always allow connection
      if (lastSelected.value === tile.value) {
        return {
          ...prev,
          selectedTiles: [...selectedTiles, tile]
        };
      }
      // For pattern of same values followed by double value
      else if (selectedTiles.length >= 2) {
        const prevTile = selectedTiles[selectedTiles.length - 2];

        if (prevTile.value === lastSelected.value && tile.value === lastSelected.value * 2) {
          return {
            ...prev,
            selectedTiles: [...selectedTiles, tile]
          };
        }
      }

      // Not a valid connection
      return prev;
    });
  }, [areAdjacent]);

  // Check if a selection pattern is valid
  const isValidSelectionPattern = useCallback((tiles: TilePosition[]): boolean => {
    if (tiles.length < 2) return false;

    // For two tiles, they should be the same value
    if (tiles.length === 2) {
      return tiles[0].value === tiles[1].value;
    }

    // For more than two tiles, check pattern
    let i = 0;
    while (i < tiles.length - 1) {
      // Check for pairs of same values
      if (i + 1 < tiles.length &&
        tiles[i].value === tiles[i + 1].value) {

        // Check if next tile is the double value
        if (i + 2 < tiles.length &&
          tiles[i + 2].value === tiles[i].value * 2) {
          i += 3; // Skip the three tiles we just verified
        } else {
          i += 2; // Skip the pair
        }
      } else {
        return false; // Invalid pattern
      }
    }

    return true;
  }, []);

  // Check if any valid moves are available
  const checkForGameOver = useCallback((board: number[][]): boolean => {
    // Check each cell for potential matches
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const currentValue = board[row][col];

        // Check neighbors (right, down, diagonal)
        const neighbors = [
          { r: row, c: col + 1 }, // right
          { r: row + 1, c: col }, // down
          { r: row + 1, c: col + 1 }, // diagonal down-right
          { r: row - 1, c: col + 1 }, // diagonal up-right
        ];

        for (const neighbor of neighbors) {
          const { r, c } = neighbor;

          // Skip if out of bounds
          if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) continue;

          const neighborValue = board[r][c];

          // Check for matching values (same value pairs)
          if (currentValue === neighborValue) {
            return false; // Found a valid move
          }

          // Check for valid pattern: 2,2,4 or similar
          if (row < BOARD_SIZE - 2 && col < BOARD_SIZE - 1) {
            // Check horizontal pattern (x,x,2x)
            if (board[row][col] === board[row][col + 1] &&
              board[row + 1][col] === board[row][col] * 2) {
              return false; // Found a valid move
            }
          }

          if (row < BOARD_SIZE - 1 && col < BOARD_SIZE - 2) {
            // Check vertical pattern (x,x,2x)
            if (board[row][col] === board[row + 1][col] &&
              board[row][col + 1] === board[row][col] * 2) {
              return false; // Found a valid move
            }
          }
        }
      }
    }

    return true; // No valid moves found
  }, []);

  // Progress to next level
  const progressToNextLevel = useCallback(() => {
    setGameState(prev => {
      const newLevel = prev.level + 1;
      const newGoal = prev.goal * 2;

      return {
        ...prev,
        level: newLevel,
        goal: newGoal,
        gameWon: false,
        gems: prev.gems + 50 // Reward for completing level
      };
    });
  }, []);

  // Confirm the current selection and update the board
  const confirmConnection = useCallback(() => {
    const { selectedTiles } = gameState;

    if (selectedTiles.length < 2) return;

    // Check if selection is valid
    if (!isValidSelectionPattern(selectedTiles)) {
      // Invalid pattern - clear selection
      setGameState(prev => ({
        ...prev,
        selectedTiles: []
      }));
      return;
    }

    // Calculate points - base value is last tile value
    const pointsEarned = selectedTiles[selectedTiles.length - 1].value;

    // Create a copy of the board
    const newBoard = gameState.board.map(row => [...row]);

    // Mark tiles as removed (set to 0) except the last one
    selectedTiles.slice(0, -1).forEach(tile => {
      newBoard[tile.row][tile.col] = 0;
    });

    // Set last tile to its new value
    const lastTile = selectedTiles[selectedTiles.length - 1];
    newBoard[lastTile.row][lastTile.col] *= 2;

    // Fill empty spaces with new tiles
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (newBoard[row][col] === 0) {
          newBoard[row][col] = Math.random() < 0.8 ? 2 : 4;
        }
      }
    }

    // Calculate new score
    const newScore = gameState.score + pointsEarned;
    const newBestScore = Math.max(gameState.bestScore, newScore);

    // Get highest value on board
    const highestValue = Math.max(...newBoard.flat());

    // Check win condition
    const gameWon = highestValue >= gameState.goal;

    // Check if there are any valid moves left
    const gameOver = !gameWon && checkForGameOver(newBoard);

    // Save best score if it's updated
    if (newBestScore > gameState.bestScore) {
      try {
        // For React Native, you would typically use AsyncStorage here
        // AsyncStorage.setItem('bestScore', newBestScore.toString());
      } catch (error) {
        console.error('Failed to save best score:', error);
      }
    }

    // Update game state
    setGameState(prev => {
      const updatedGems = prev.gems + Math.floor(pointsEarned / 8);
      return {
        ...prev,
        board: newBoard,
        score: newScore,
        bestScore: newBestScore,
        highestValue,
        selectedTiles: [],
        gameWon,
        gameOver,
        validPatternFound: null,
        gems: updatedGems
      };
    });

    // Reset animation
    validPatternAnim.setValue(0);
  }, [gameState, isValidSelectionPattern, validPatternAnim, checkForGameOver]);

  // Create pan responder for handling swipe gestures
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // Only activate for movements larger than threshold
      return Math.abs(gestureState.dx) > SWIPE_THRESHOLD ||
        Math.abs(gestureState.dy) > SWIPE_THRESHOLD;
    },
    onPanResponderGrant: (event: GestureResponderEvent) => {
      if (!gameState.swipeMode) return;

      // Get absolute position
      const { pageX, pageY } = event.nativeEvent;
      
      // Get tile at this position
      const startTile = getTileAtPosition(pageX, pageY);

      if (startTile) {
        // Reset selection when starting a new swipe
        setGameState(prev => ({
          ...prev,
          selectedTiles: [startTile],
          swipePath: [{ x: pageX, y: pageY }],
          validPatternFound: null
        }));

        // Update gesture state
        gestureStateRef.current = {
          isActive: true,
          startX: pageX,
          startY: pageY,
          lastTile: startTile
        };
      }
    },
    onPanResponderMove: (event: GestureResponderEvent) => {
      if (!gameState.swipeMode || !gestureStateRef.current.isActive) return;

      // Get absolute position
      const { pageX, pageY } = event.nativeEvent;

      // Add point to swipe path
      setGameState(prev => ({
        ...prev,
        swipePath: [...prev.swipePath, { x: pageX, y: pageY }]
      }));

      const currentTile = getTileAtPosition(pageX, pageY);
      const { lastTile } = gestureStateRef.current;

      if (currentTile && lastTile &&
        (currentTile.row !== lastTile.row || currentTile.col !== lastTile.col)) {

        // Get current selected tiles
        const currentSelection = [...gameState.selectedTiles];

        // Check if we would add this tile
        const potentialSelection = [...currentSelection, currentTile];

        // Add tile to selection
        addTileToSelection(currentTile);

        // Check if current pattern is valid
        const isValid = isValidSelectionPattern(potentialSelection);

        // Update validation state
        setGameState(prev => ({
          ...prev,
          validPatternFound: isValid
        }));

      
        // Update last tile
        gestureStateRef.current.lastTile = currentTile;
      }
    },
    onPanResponderRelease: () => {
      if (!gameState.swipeMode) return;

      // If we have a valid pattern, confirm it
      if (gameState.validPatternFound && gameState.selectedTiles.length >= 2) {
        confirmConnection();
      }

      // Reset gesture state
      gestureStateRef.current.isActive = false;
      gestureStateRef.current.lastTile = null;

      // Clear path with a slight delay to show completion feedback
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          swipePath: [],
          validPatternFound: null
        }));
      }, gameState.validPatternFound ? 500 : 0);
    }
  }), [gameState.swipeMode, getTileAtPosition, addTileToSelection,
  gameState.selectedTiles, gameState.validPatternFound,
    isValidSelectionPattern, confirmConnection]);

  // Toggle swipe mode
  const toggleSwipeMode = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      swipeMode: !prev.swipeMode,
      selectedTiles: [], // Clear selection when toggling modes
      showTutorial: !prev.swipeMode && !prev.showTutorial ? true : false
    }));
  }, []);

  // Close tutorial
  const closeTutorial = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showTutorial: false
    }));
  }, []);

  // Handle tile tap (for tap mode)
  const handleTilePress = useCallback((row: number, col: number): void => {
    if (gameState.animationInProgress || gameState.swipeMode) return;

    const tileValue = gameState.board[row][col];
    const tilePosition = { row, col, value: tileValue };

    setGameState(prev => {
      const { selectedTiles } = prev;

      // If no tiles selected yet, select this one
      if (selectedTiles.length === 0) {
        return {
          ...prev,
          selectedTiles: [tilePosition]
        };
      }

      // Get the last selected tile
      const lastSelected = selectedTiles[selectedTiles.length - 1];

      // Check if this tile is already selected
      const isAlreadySelected = selectedTiles.some(
        t => t.row === row && t.col === col
      );

      // If clicking the last selected tile, confirm the selection
      if (isAlreadySelected &&
        lastSelected.row === row &&
        lastSelected.col === col &&
        selectedTiles.length > 1) {

        // Handle in next tick to avoid state update conflicts
        setTimeout(() => confirmConnection(), 0);

        return prev;
      }

      // If clicking the same tile again, deselect it
      if (isAlreadySelected) {
        return {
          ...prev,
          selectedTiles: selectedTiles.filter(
            t => !(t.row === row && t.col === col)
          )
        };
      }

      // If not adjacent to last selected tile, start new selection
      if (!areAdjacent(lastSelected, tilePosition)) {
        return {
          ...prev,
          selectedTiles: [tilePosition]
        };
      }

      // Check if valid connection based on values
      if (lastSelected.value === tileValue) {
        return {
          ...prev,
          selectedTiles: [...selectedTiles, tilePosition]
        };
      }
      else if (selectedTiles.length >= 2) {
        const prevTile = selectedTiles[selectedTiles.length - 2];

        if (prevTile.value === lastSelected.value && tileValue === lastSelected.value * 2) {
          return {
            ...prev,
            selectedTiles: [...selectedTiles, tilePosition]
          };
        }
      }

      // Not a valid connection, start new selection
      return {
        ...prev,
        selectedTiles: [tilePosition]
      };
    });
  }, [gameState.animationInProgress, gameState.swipeMode, gameState.board, areAdjacent, confirmConnection]);

  // Render the game board
  const renderBoard = useCallback(() => {
    const { board, selectedTiles, swipeMode } = gameState;

    return (
      <View
        ref={boardRef}
        style={styles.board}
        {...(swipeMode ? panResponder.panHandlers : {})}
        onLayout={() => {
          boardRef.current?.measure((x, y, width, height, pageX, pageY) => {
            setBoardPosition({ x: pageX, y: pageY });
          });
        }}
      >
        {/* Render board tiles */}
        {board.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, colIndex) => {
              // Check if cell is selected
              const isSelected = selectedTiles.some(
                tile => tile.row === rowIndex && tile.col === colIndex
              );

              // Get selection index for indicator
              const selectionIndex = selectedTiles.findIndex(
                tile => tile.row === rowIndex && tile.col === colIndex
              );

              return (
                <TouchableOpacity
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={styles.cellContainer}
                  onPress={() => !swipeMode && handleTilePress(rowIndex, colIndex)}
                  activeOpacity={swipeMode ? 1 : 0.7}
                >
                  <View
                    style={[
                      styles.cell,
                      { backgroundColor: COLORS[cell] || '#ccc' },
                      isSelected && styles.selectedCell
                    ]}
                  >
                    <Text style={[
                      styles.cellText,
                      { color: getTextColor(cell), fontSize: getFontSize(cell) }
                    ]}>
                      {cell}
                    </Text>
                    {isSelected && (
                      <View style={styles.selectionBadge}>
                        <Text style={styles.selectionBadgeText}>
                          {selectionIndex + 1}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {swipeMode}
        {swipeMode && (
          <View style={styles.swipeModeIndicator}>
            <Text style={styles.swipeModeText}>SWIPE</Text>
          </View>
        )}
      </View>
    );
  }, [gameState.board, gameState.selectedTiles, gameState.swipeMode,
  panResponder.panHandlers, handleTilePress]);

  // Main render function
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <GameInfo
          score={gameState.score}
          bestScore={gameState.bestScore}
          level={gameState.level}
          goal={gameState.goal}
        />
      </View>
      <ModeToggle
        swipeMode={gameState.swipeMode}
        onToggle={toggleSwipeMode}
      />
      {renderBoard()}
      <CompletionMessage
        visible={!!gameState.validPatternFound}
        hasPath={gameState.swipePath.length > 0}
        animation={validPatternAnim}
      />
      <TutorialOverlay
        visible={gameState.showTutorial}
        swipeMode={gameState.swipeMode}
        onClose={closeTutorial}
      />
      <GameOverlay
        gameOver={gameState.gameOver}
        gameWon={gameState.gameWon}
        onRestart={initializeBoard}
        onNextLevel={progressToNextLevel}
      />
      <GameControls onNewGame={initializeBoard} />
    </SafeAreaView>
  );
}