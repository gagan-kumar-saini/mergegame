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
  Image,
  ImageBackground,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../utils/Styles'
import { BOARD_SIZE, CELL_SIZE, CELL_MARGIN, SWIPE_THRESHOLD, COLORS } from '../utils/Constants'
import { getTextColor, getFontSize } from '../utils/Utils'
import { GameState, GestureState, TilePosition } from '../types/GameTypes'
import GameInfo from '../components/GameInfo';
import GameOverlay from '../components/GameOverlay';
import GradientIconButton from '../components/GameButton';
import { saveGameState, loadGameState } from '../utils/GamePersistence';
import { createTileAnimations } from '../services/tileAnimations';
import { AdBanner } from '../components/AdBanner'
import {
  loadRewardedAd,
  showRewardedAd,
} from '../utils/admobUtils';


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
    matchCount: 0,
    animationInProgress: false,
    swipeMode: true,
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
      boardRef.current.measure((pageX, pageY) => {
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
    loadRewardedAd("ca-app-pub-5686269557208989/9510232896");
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
        const prevGroup = consecutiveGroups[i - 1];
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
      saveGameState(gameState);
      return true;

    }

    return false;
  }, []);


  const shuffleBoard = useCallback(() => {
    // Collect all non-zero tiles from the current board
    const nonZeroTiles: number[] = [];
    gameState.board.forEach(row => {
      row.forEach(cell => {
        if (cell !== 0) {
          nonZeroTiles.push(cell);
        }
      });
    });

    // Shuffle the collected tiles
    for (let i = nonZeroTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nonZeroTiles[i], nonZeroTiles[j]] = [nonZeroTiles[j], nonZeroTiles[i]];
    }

    // Create a new board with shuffled tiles and fill empty spaces
    const newBoard = Array(BOARD_SIZE).fill(0).map(() => 
      Array(BOARD_SIZE).fill(0).map(() => {
        // If we have shuffled tiles left, use one; otherwise, generate a new tile
        return nonZeroTiles.length > 0 
          ? nonZeroTiles.pop()! 
          : (Math.random() < 0.8 ? 2 : 4)
      })
    );

    // Calculate the cost of shuffling
    const shuffleCost = 50; // Adjust this value as needed

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      gems: Math.max(0, prev.gems - shuffleCost), // Deduct gems, but don't go below 0
      selectedTiles: [],
      validPatternFound: null
    }));
  }, [gameState.board]);

   const swapTiles = useCallback(() => {
    // Check if exactly two tiles are selected
    if (gameState.selectedTiles.length !== 2) {
      Alert.alert(
        'Invalid Swap', 
        'Please select exactly two tiles to swap.',
        [{ text: 'OK', style: 'cancel' }]
      );
      return;
    }

    const newBoard = gameState.board.map(row => [...row]);

    const [tile1, tile2] = gameState.selectedTiles;

    // Swap the values
    [newBoard[tile1.row][tile1.col], newBoard[tile2.row][tile2.col]] = 
    [newBoard[tile2.row][tile2.col], newBoard[tile1.row][tile1.col]];

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      selectedTiles: [], // Clear selection after swap
      gems: prev.gems // Deduct swap cost
    }));
  }, [gameState.selectedTiles, gameState.board, gameState.gems]);

  // Modify the tile press handler to support swap mode
  const handleTilePress = useCallback((rowIndex: number, colIndex: number) => {
    // Only handle tile press when not in swipe mode (i.e., in swap mode)
    if (gameState.swipeMode) return;

    const currentTile: TilePosition = {
      row: rowIndex,
      col: colIndex,
      value: gameState.board[rowIndex][colIndex]
    };

    setGameState(prev => {
      const currentSelectedTiles = prev.selectedTiles;

      // If no tiles selected, select the current tile
      if (currentSelectedTiles.length === 0) {
        return { ...prev, selectedTiles: [currentTile] };
      }

      // If one tile already selected
      if (currentSelectedTiles.length === 1) {
        // Prevent selecting the same tile twice
        if (currentSelectedTiles[0].row === rowIndex && 
            currentSelectedTiles[0].col === colIndex) {
          return prev;
        }

        // Add the second tile
        return { 
          ...prev, 
          selectedTiles: [...currentSelectedTiles, currentTile] 
        };
      }

      // If two tiles already selected, reset to the new tile
      return { 
        ...prev, 
        selectedTiles: [currentTile] 
      };
    });
  }, [gameState.board, gameState.swipeMode]);

  const progressToNextLevel = useCallback(() => {
    showRewardedAd(
      () => {
        console.log('User earned a reward!');
        // Handle reward logic here
      }
    );// Play full-screen ad here
    setGameState(prev => {
      // Store goal in local storage
      try {
        AsyncStorage.setItem('goal', (prev.goal).toString());
      } catch (error) {
        console.error('Failed to save goal:', error);
      }
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

    const disappearAnimations = tilesToDisappear.map(tile => {
      tileAnimations[tile.row][tile.col].scale.setValue(1);
      tileAnimations[tile.row][tile.col].opacity.setValue(1);
      tileAnimations[tile.row][tile.col].rotate.setValue(0);

      return Animated.sequence([

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

      if (newBestScore > gameState.bestScore) {
        try {
          AsyncStorage.setItem('bestScore', newBestScore.toString());
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
          validPatternFound: null,
          gems: updatedGems
        };
      });

      validPatternAnim.setValue(0);
    });
  }, [gameState, isValidSelectionPattern, validPatternAnim, animateMatchingTiles]);

  const findLongestValidSubsequence = (tiles: TilePosition[]): TilePosition[] => {
    if (tiles.length < 2) return [];
    for (let end = tiles.length; end >= 2; end--) {
      const subsequence = tiles.slice(0, end);
      if (isValidSelectionPattern(subsequence)) {
        return subsequence;
      }
    }

    const firstValue = tiles[0].value;
    let sameValueCount = 1;

    for (let i = 1; i < tiles.length; i++) {
      if (tiles[i].value === firstValue) {
        sameValueCount++;
      } else {
        break;
      }
    }
    if (sameValueCount >= 2) {
      return tiles.slice(0, sameValueCount);
    }

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
            duration: 100,
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
          confirmConnection()
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
    }
  }), [gameState.swipeMode, getTileAtPosition, addTileToSelection,
  gameState.selectedTiles, gameState.validPatternFound,
    isValidSelectionPattern, confirmConnection, validPatternAnim]);

  const renderBoard = useCallback(() => {
    const { board, selectedTiles, swipeMode } = gameState;

    return (
      <View
        ref={boardRef}
        style={styles.board}
        {...(swipeMode ? panResponder.panHandlers : {})}
        onLayout={() => {
          boardRef.current?.measure((pageX, pageY) => {
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

      </View>
    );
  }, [gameState.board, gameState.selectedTiles, gameState.swipeMode, gameState.swipePath,
  panResponder.panHandlers, tileAnimations, mergeAnimation, boardPosition]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../assets/images/bg-pattern.png')}
        style={styles.backgroundPattern}
      >
        <View>
          <View style={styles.header} >
            <GameInfo
              score={gameState.score}
              bestScore={gameState.bestScore}
              level={gameState.level}
              goal={gameState.goal}
            />
          </View>
          {renderBoard()}
          <GameOverlay
            gameOver={gameState.gameOver}
            gameWon={gameState.gameWon}
            onRestart={initializeBoard}
            onNextLevel={progressToNextLevel}
          />
          <View style={styles.buttonsContainer}>
            <GradientIconButton
              imagePath={require('../assets/images/shuffle.png')}
              onPress={() => shuffleBoard()}
            />
            <GradientIconButton
              imagePath={require('../assets/images/swap.png')}
             onPress={() => swapTiles()}
            />
            <View style={styles.pauseButton}>
            <GradientIconButton
              imagePath={require('../assets/images/pause_button.png')}
              onPress={() => console.log('Pressed')}
            />
            </View>
          </View>
        </View>
        <View style={styles.bannerContainer}>
          <AdBanner adUnitId={'ca-app-pub-5686269557208989/6455784018'} />
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
};