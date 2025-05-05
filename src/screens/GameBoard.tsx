import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  StatusBar,
  PanResponder,
  GestureResponderEvent,
  Easing,
  AppState,
  AppStateStatus,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { styles } from '../utils/Styles'
import { BOARD_SIZE, CELL_SIZE, CELL_MARGIN, SWIPE_THRESHOLD, COLORS } from '../utils/Constants'
import { getTextColor, getFontSize } from '../utils/Utils'
import { GameState, GestureState, TilePosition } from '../types/GameTypes'
import TutorialOverlay from '../components/TutorialOverlay';
import GameInfo from '../components/GameInfo';
import ModeToggle from '../components/ModeToggle';
import CompletionMessage from '../components/CompletionMessage';
import GameOverlay from '../components/GameOverlay';
import GameControls from '../components/NewGame';
import { saveGameState, loadGameState } from '../utils/GamePersistence';
import { createTileAnimations } from '../services/tileAnimations';

const ANIMATION_DURATION = 500;

export default function App() {
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
    matchCount:0,
    animationInProgress: false,
    swipeMode: false,
    showTutorial: true,
    swipePath: [],
    validPatternFound: null
  });
  const tileAnimations = useMemo(() => createTileAnimations(BOARD_SIZE), []);
  const validPatternAnim = useRef(new Animated.Value(0)).current;
  
  const mergeAnimation = useRef(new Animated.Value(1)).current;

  const gestureStateRef = useRef<GestureState>({
    isActive: false,
    startX: 0,
    startY: 0,
    lastTile: null
  });

  const boardRef = useRef<View>(null);
  const [boardPosition, setBoardPosition] = useState({ x: 0, y: 0 });

  const appStateRef = useRef(AppState.currentState);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (boardRef.current) {
      boardRef.current.measure((x, y, width, height, pageX, pageY) => {
        setBoardPosition({ x: pageX, y: pageY });
      });
    }
  }, []);

  const initializeBoard = useCallback(() => {
    const newBoard = Array(BOARD_SIZE).fill(0).map(() =>
      Array(BOARD_SIZE).fill(0).map(() =>
        Math.random() < 0.8 ? 2 : 4
      )
    
    );

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      score: 0,
      bestScore: prev.bestScore,
      gems: prev.gems,
      level: 1,
      goal: 32,
      selectedTiles: [],
      gameOver: false,
      gameWon: false,
      matchCount: 0
    }));
  }, []);

  useEffect(() => {
    const loadSavedGameState = async () => {
      const savedState = await loadGameState();
      if (savedState) {
        setGameState(prev => ({
          ...prev,
          ...savedState,
          // Reset these properties to ensure consistency
          selectedTiles: [],
          animationInProgress: false,
          swipePath: [],
          validPatternFound: null
        }));
      } else {
        // No saved state, initialize new board
        initializeBoard();
      }
    };

    loadSavedGameState();
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/active/) && 
        (nextAppState === 'background' || nextAppState === 'inactive')
      ) {
        // App is going to background or becoming inactive, save the state
        saveGameState(gameState);
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [gameState]);

  useEffect(() => {
    // Skip saving on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
  });

  const getTileAtPosition = useCallback((x: number, y: number): TilePosition | null => {
    const relativeX = x - boardPosition.x;
    const relativeY = y - boardPosition.y;
    
    const boardX = Math.floor(relativeX / (CELL_SIZE + CELL_MARGIN * 2));
    const boardY = Math.floor(relativeY / (CELL_SIZE + CELL_MARGIN * 2));

    if (boardX >= 0 && boardX < BOARD_SIZE && boardY >= 0 && boardY < BOARD_SIZE) {
      return {
        row: boardY,
        col: boardX,
        value: gameState.board[boardY][boardX]
      };
    }
    return null;
  }, [gameState.board, boardPosition]);

  const areAdjacent = useCallback((pos1: TilePosition, pos2: TilePosition): boolean => {
    return (
      (Math.abs(pos1.row - pos2.row) === 0 && Math.abs(pos1.col - pos2.col) === 1) ||
      (Math.abs(pos1.row - pos2.row) === 1 && Math.abs(pos1.col - pos2.col) === 0) ||
      (Math.abs(pos1.row - pos2.row) === 1 && Math.abs(pos1.col - pos2.col) === 1)
    );
  }, []);

  const addTileToSelection = useCallback((tile: TilePosition): void => {
    if (!tile) return;
      
    setGameState(prev => {
      const { selectedTiles } = prev;
        
      // Don't add if already selected
      if (selectedTiles.some(t => t.row === tile.row && t.col === tile.col)) {
        return prev;
      }
        
      // First tile selection
      if (selectedTiles.length === 0) {
        return { ...prev, selectedTiles: [tile] };
      }
        
      const lastTile = selectedTiles[selectedTiles.length - 1];
      
      // Must be adjacent
      if (!areAdjacent(lastTile, tile)) {
        return prev;
      }
        
      // Rule 1: Always allow adding more tiles of the same value
      if (tile.value === lastTile.value) {
        return { ...prev, selectedTiles: [...selectedTiles, tile] };
      }
      
      // Rule 2: Check if new tile value is double or half of the previous tiles group
      const selectedValues = selectedTiles.map(t => t.value);
      const lastValue = lastTile.value;
      
      // Count consecutive tiles with the same value at the end
      let count = 0;
      for (let i = selectedTiles.length - 1; i >= 0; i--) {
        if (selectedTiles[i].value === lastValue) {
          count++;
        } else {
          break;
        }
      }
      
      // Allow adding a double-value tile after at least 2 of the same value
      if (count >= 2 && tile.value === lastValue * 2) {
        return { ...prev, selectedTiles: [...selectedTiles, tile] };
      }
      
      // Removed half-value tile transition as it's not valid
      
      return prev;
    });
  }, [areAdjacent]);
  
  const isValidSelectionPattern = useCallback((tiles: TilePosition[]): boolean => {
    if (tiles.length < 2) return false;
    
    // Group consecutive tiles by value
    const consecutiveGroups: TilePosition[][] = [];
    let currentGroup: TilePosition[] = [tiles[0]];
    
    for (let i = 1; i < tiles.length; i++) {
      if (tiles[i].value === currentGroup[0].value) {
        currentGroup.push(tiles[i]);
      } else {
        consecutiveGroups.push([...currentGroup]);
        currentGroup = [tiles[i]];
      }
    }
    
    if (currentGroup.length > 0) {
      consecutiveGroups.push(currentGroup);
    }
    
    // Case 1: All tiles have the same value (at least 2 tiles)
    if (consecutiveGroups.length === 1) {
      return tiles.length >= 2;
    }
    
    // Case 2: We have exactly two groups with different values
    if (consecutiveGroups.length === 2) {
      const [group1, group2] = consecutiveGroups;
      
      // Check if second group's value is double the first group's value
      // Only allow progression from smaller to larger values (2,2 → 4)
      if (group1[0].value * 2 === group2[0].value) {
        // At least 2 tiles in the first group before adding the second group
        return group1.length >= 2;
      }
    }
    
    // Case 3: Multiple groups in a valid pattern (like 2,2,2,4,4)
    if (consecutiveGroups.length > 2) {
      for (let i = 1; i < consecutiveGroups.length; i++) {
        const prevGroup = consecutiveGroups[i-1];
        const currGroup = consecutiveGroups[i];
        
        // Each transition should follow the double value rule (smaller → larger)
        // And the previous group should have at least 2 tiles
        if (
          prevGroup.length < 2 || 
          prevGroup[0].value * 2 !== currGroup[0].value
        ) {
          return false;
        }
      }
      return true;
    }
    
    return false;
  }, []);
  

  const checkForGameOver = useCallback((board: (TilePosition | null)[][]): boolean => {
    // Game is over if player has made 15 matches and no more matches are available
    if (gameState.matchCount >= 15) {
      return true;
    }
    
    // Check all possible valid patterns on the board
    
    // First convert board to a simple 2D array of values for easier processing
    const valueBoard: (number | null)[][] = board.map(row => 
      row.map(cell => cell ? cell.value : null)
    );
    
    // Check all possible valid patterns
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[0].length; col++) {
        const value = valueBoard[row][col];
        if (value === null) continue;
        
        // Check all possible directions for matches
        const directions = [
          { dr: 0, dc: 1 }, // right
          { dr: 1, dc: 0 }, // down
          { dr: 1, dc: 1 }, // diagonal down-right
          { dr: -1, dc: 1 }, // diagonal up-right
        ];
        
        // Check for pairs of same value tiles
        for (const { dr, dc } of directions) {
          const r2 = row + dr;
          const c2 = col + dc;
          
          if (r2 < 0 || r2 >= board.length || c2 < 0 || c2 >= board[0].length) continue;
          if (valueBoard[r2][c2] === value) {
            // Found a pair, now check for adjacent tiles that would make a valid pattern
            
            // Pattern 1: Two same value tiles + a third same value tile
            const adjacentDirs = [
              { dr: dr, dc: dc }, // Same direction
              { dr: -dr, dc: -dc }, // Opposite direction
              { dr: dc, dc: -dr }, // Perpendicular (rotated 90 degrees)
              { dr: -dc, dc: dr }, // Perpendicular (rotated -90 degrees)
            ];
            
            for (const { dr: adr, dc: adc } of adjacentDirs) {
              const r3 = r2 + adr;
              const c3 = c2 + adc;
              
              if (r3 >= 0 && r3 < board.length && c3 >= 0 && c3 < board[0].length) {
                if (valueBoard[r3][c3] === value) {
                  return false; // Valid pattern found: three tiles of same value
                }
              }
            }
            
            // Pattern 2: Two same value tiles + a double value tile
            const doubleCheckDirs = [
              { dr: dr, dc: dc }, // Same direction
              { dr: -dr, dc: -dc }, // Opposite direction
              { dr: dc, dc: -dr }, // Perpendicular
              { dr: -dc, dc: dr }, // Perpendicular
            ];
            
            for (const { dr: ddr, dc: ddc } of doubleCheckDirs) {
              const r3 = r2 + ddr;
              const c3 = c2 + ddc;
              
              if (r3 >= 0 && r3 < board.length && c3 >= 0 && c3 < board[0].length) {
                if (valueBoard[r3][c3] === value * 2) {
                  return false; // Valid pattern found: two tiles + a double value
                }
              }
            }
            
            // If we only need to check for pairs, we could return false here as well
            // Since a pair of same values is always a valid match
            return false;
          }
        }
      }
    }
    
    return true; // No valid moves found
  }, [gameState.matchCount]);

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

  const animateMatchingTiles = useCallback((selectedTiles: TilePosition[], onComplete: () => void) => {
    setGameState(prev => ({
      ...prev,
      animationInProgress: true
    }));

    const tilesToDisappear = selectedTiles.slice(0, -1);
    const lastTile = selectedTiles[selectedTiles.length - 1];
    
    const disappearAnimations = tilesToDisappear.map(tile => {
      tileAnimations[tile.row][tile.col].scale.setValue(1);
      tileAnimations[tile.row][tile.col].opacity.setValue(1);
      tileAnimations[tile.row][tile.col].rotate.setValue(0);
 
      return Animated.sequence([
        Animated.timing(tileAnimations[tile.row][tile.col].scale, {
          toValue: 1.2,
          duration: ANIMATION_DURATION / 2,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad)
        }),
        Animated.parallel([
          Animated.timing(tileAnimations[tile.row][tile.col].scale, {
            toValue: 0.1,
            duration: ANIMATION_DURATION / 2,
            useNativeDriver: true,
            easing: Easing.out(Easing.quad)
          }),
          Animated.timing(tileAnimations[tile.row][tile.col].opacity, {
            toValue: 0,
            duration: ANIMATION_DURATION / 2,
            useNativeDriver: true
          }),
          Animated.timing(tileAnimations[tile.row][tile.col].rotate, {
            toValue: 1,  // Will be interpolated to radians in the transform
            duration: ANIMATION_DURATION / 2,
            useNativeDriver: true
          })
        ])
      ]);
    });
    
    mergeAnimation.setValue(1);
    const mergeAnimationSequence = Animated.sequence([
      Animated.delay(ANIMATION_DURATION / 1),
      Animated.timing(mergeAnimation, {
        toValue: 1.4,
        duration: ANIMATION_DURATION / 2,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(mergeAnimation, {
        toValue: 1,
        duration: ANIMATION_DURATION / 3,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.cubic)
      })
    ]);
    Animated.parallel([
      ...disappearAnimations,
      mergeAnimationSequence
    ]).start(() => {
      tilesToDisappear.forEach(tile => {
        tileAnimations[tile.row][tile.col].scale.setValue(1);
        tileAnimations[tile.row][tile.col].opacity.setValue(1);
        tileAnimations[tile.row][tile.col].rotate.setValue(0);
      });
      
      setGameState(prev => ({
        ...prev,
        animationInProgress: false
      }));
      
      onComplete();
    });
  }, [tileAnimations, mergeAnimation]);

  const confirmConnection = useCallback(() => {
    const { selectedTiles } = gameState;
    if (selectedTiles.length < 2) return;
    if (!isValidSelectionPattern(selectedTiles)) {
      setGameState(prev => ({
        ...prev,
        selectedTiles: []
      }));
      return;
    }

    const pointsEarned = selectedTiles[selectedTiles.length - 1].value;

    const newBoard = gameState.board.map(row => [...row]);
    
    animateMatchingTiles(selectedTiles, () => {
      selectedTiles.slice(0, -1).forEach(tile => {
        newBoard[tile.row][tile.col] = 0;
      });

      const lastTile = selectedTiles[selectedTiles.length - 1];
      newBoard[lastTile.row][lastTile.col] *= 2;

      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          if (newBoard[row][col] === 0) {
            newBoard[row][col] = Math.random() < 0.8 ? 2 : 4;
          }
        }
      }

      const newScore = gameState.score + pointsEarned;
      const newBestScore = Math.max(gameState.bestScore, newScore);

      const highestValue = Math.max(...newBoard.flat());


      const gameWon = highestValue >= gameState.goal;

      const convertedBoard = newBoard.map((row, rowIndex) =>
        row.map((value, colIndex) => ({
          row: rowIndex,
          col: colIndex,
          value,
        }))
      );
      const gameOver = !gameWon && checkForGameOver(convertedBoard);

      if (newBestScore > gameState.bestScore) {
        try {
          // For React Native, you would typically use AsyncStorage here
          // AsyncStorage.setItem('bestScore', newBestScore.toString());
        } catch (error) {
          console.error('Failed to save best score:', error);
        }
      }

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

      validPatternAnim.setValue(0);
    });
  }, [gameState, isValidSelectionPattern, validPatternAnim, checkForGameOver, animateMatchingTiles]);

  // This function finds the longest valid subsequence in a selection of tiles
const findLongestValidSubsequence = (tiles: TilePosition[]): TilePosition[] => {
  if (tiles.length < 2) return [];
  
  // Try different length subsequences, starting from the full selection
  // and working backward to find the longest valid one
  for (let end = tiles.length; end >= 2; end--) {
    const subsequence = tiles.slice(0, end);
    if (isValidSelectionPattern(subsequence)) {
      return subsequence;
    }
  }
  
  // Check if we have consecutive same-value tiles
  const firstValue = tiles[0].value;
  let sameValueCount = 1;
  
  for (let i = 1; i < tiles.length; i++) {
    if (tiles[i].value === firstValue) {
      sameValueCount++;
    } else {
      break;
    }
  }
  
  // If we have at least 2 same-value tiles, that's a valid pattern
  if (sameValueCount >= 2) {
    return tiles.slice(0, sameValueCount);
  }
  
  // No valid subsequence found
  return [];
}

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > SWIPE_THRESHOLD ||
        Math.abs(gestureState.dy) > SWIPE_THRESHOLD;
    },
    onPanResponderGrant: (event: GestureResponderEvent) => {
      if (!gameState.swipeMode) return;

      const { pageX, pageY } = event.nativeEvent;
    
      const startTile = getTileAtPosition(pageX, pageY);

      if (startTile) {
    
        setGameState(prev => ({
          ...prev,
          selectedTiles: [startTile],
          swipePath: [{ x: pageX, y: pageY }],
          validPatternFound: null
        }));

   
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

      const { pageX, pageY } = event.nativeEvent;

      setGameState(prev => ({
        ...prev,
        swipePath: [...prev.swipePath, { x: pageX, y: pageY }]
      }));

      const currentTile = getTileAtPosition(pageX, pageY);
      const { lastTile } = gestureStateRef.current;

      if (currentTile && lastTile &&
        (currentTile.row !== lastTile.row || currentTile.col !== lastTile.col)) {

        const currentSelection = [...gameState.selectedTiles];

        const potentialSelection = [...currentSelection, currentTile];

        addTileToSelection(currentTile);

        const isValid = isValidSelectionPattern(potentialSelection);

        setGameState(prev => ({
          ...prev,
          validPatternFound: isValid
        }));

        if (isValid) {
          Animated.timing(validPatternAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
          }).start();
        }

        gestureStateRef.current.lastTile = currentTile;
      }
    },
    onPanResponderRelease: () => {
      if (!gameState.swipeMode) return;
        
      // Check if we have any valid sequence in the current selection
      if (gameState.selectedTiles.length >= 2) {
        // Find the longest valid subsequence
        const validSubsequence = findLongestValidSubsequence(gameState.selectedTiles);
        
        if (validSubsequence.length >= 2) {
          // If we have a valid subsequence, use it instead of the full selection
          setGameState(prev => ({
            ...prev,
            selectedTiles: validSubsequence
          }));
          
          // Confirm the connection with the valid subsequence
          setTimeout(() => confirmConnection(), 50);
        } else {
          // No valid subsequence found, clear selection
          setGameState(prev => ({
            ...prev,
            selectedTiles: []
          }));
        }
      } else {
        // Less than 2 tiles selected, clear selection
        setGameState(prev => ({
          ...prev,
          selectedTiles: []
        }));
      }
        
      gestureStateRef.current.isActive = false;
      gestureStateRef.current.lastTile = null;
        
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          swipePath: [],
          validPatternFound: null
        }));
      }, gameState.validPatternFound ? 500 : 0);
    }}), [gameState.swipeMode, getTileAtPosition, addTileToSelection,
  gameState.selectedTiles, gameState.validPatternFound,
    isValidSelectionPattern, confirmConnection, validPatternAnim]);

  const toggleSwipeMode = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      swipeMode: !prev.swipeMode,
      selectedTiles: [],
      showTutorial: !prev.swipeMode && !prev.showTutorial ? true : false
    }));
  }, []);


  const closeTutorial = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showTutorial: false
    }));
  }, []);

  const handleTilePress = useCallback((row: number, col: number): void => {
    if (gameState.animationInProgress || gameState.swipeMode) return;

    const tileValue = gameState.board[row][col];
    const tilePosition = { row, col, value: tileValue };

    setGameState(prev => {
      const { selectedTiles } = prev;

      if (selectedTiles.length === 0) {
        // Removed animation that increases tile size
        return {
          ...prev,
          selectedTiles: [tilePosition]
        };
      }

      const lastSelected = selectedTiles[selectedTiles.length - 1];

      const isAlreadySelected = selectedTiles.some(
        t => t.row === row && t.col === col
      );

      if (isAlreadySelected &&
        lastSelected.row === row &&
        lastSelected.col === col &&
        selectedTiles.length > 1) {

        setTimeout(() => confirmConnection(), 0);

        return prev;
      }

      if (isAlreadySelected) {
        return {
          ...prev,
          selectedTiles: selectedTiles.filter(
            t => !(t.row === row && t.col === col)
          )
        };
      }

      if (!areAdjacent(lastSelected, tilePosition)) {
        // Removed animation that increases tile size
        return {
          ...prev,
          selectedTiles: [tilePosition]
        };
      }
      if (lastSelected.value === tileValue) {
        // Removed animation that increases tile size
        return {
          ...prev,
          selectedTiles: [...selectedTiles, tilePosition]
        };
      }
      else if (selectedTiles.length >= 2) {
        const prevTile = selectedTiles[selectedTiles.length - 2];

        if (prevTile.value === lastSelected.value && tileValue === lastSelected.value * 2) {
          // Removed animation that increases tile size
          return {
            ...prev,
            selectedTiles: [...selectedTiles, tilePosition]
          };
        }
      }

      // Removed animation that increases tile size
      return {
        ...prev,
        selectedTiles: [tilePosition]
      };
    });
  }, [gameState.animationInProgress, gameState.swipeMode, gameState.board, areAdjacent, confirmConnection]);

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
              
              // Check if this is the last tile in the selection
              const isLastSelectedTile = 
                selectionIndex === selectedTiles.length - 1 && 
                selectionIndex > 0;
              
              // Apply rotation transform for disappearing tiles
              const rotateAnimation = tileAnimations[rowIndex][colIndex].rotate.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg']
              });

              return (
                <TouchableOpacity
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={styles.cellContainer}
                  onPress={() => !swipeMode && handleTilePress(rowIndex, colIndex)}
                  activeOpacity={swipeMode ? 1 : 0.7}
                >
                  <Animated.View
                    style={[
                      styles.cell,
                      { backgroundColor: COLORS[cell] || '#ccc' },
                      isSelected && styles.selectedCell,
                      {
                        transform: [
                          { 
                            scale: isLastSelectedTile 
                              ? mergeAnimation 
                              : tileAnimations[rowIndex][colIndex].scale 
                          },
                          { rotate: rotateAnimation }
                        ],
                        opacity: tileAnimations[rowIndex][colIndex].opacity,
                      }
                    ]}
                  >
                    <Text style={[
                      styles.cellText,
                      { color: getTextColor(cell), fontSize: getFontSize(cell) }
                    ]}>
                      {cell}
                    </Text>
                    {isSelected && (
                      <Animated.View 
                        style={[
                          styles.selectionBadge,
                          isLastSelectedTile && { transform: [{ scale: mergeAnimation }] }
                        ]}
                      >
                        <Text style={styles.selectionBadgeText}>
                          {selectionIndex + 1}
                        </Text>
                      </Animated.View>
                    )}
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {gameState.swipePath.length > 1 && gameState.swipeMode && (
          <View  pointerEvents="none">
            <Svg height="100%" width="100%" >
              <Path
                d={`M ${gameState.swipePath.map(p => `${p.x - boardPosition.x},${p.y - boardPosition.y}`).join(' L ')}`}
                stroke={gameState.validPatternFound ? "#4CAF50" : "#E91E63"}
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="5,5"
              />
            </Svg>
          </View>
        )}

        {swipeMode && (
          <View style={styles.swipeModeIndicator}>
            <Text style={styles.swipeModeText}>SWIPE</Text>
          </View>
        )}
      </View>
    );
  }, [gameState.board, gameState.selectedTiles, gameState.swipeMode, gameState.swipePath,
  panResponder.panHandlers, handleTilePress, tileAnimations, mergeAnimation, boardPosition]);

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
  )};