import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { styles } from '../utils/Styles';

interface GameInfoProps {
  score: number;
  bestScore: number;
  level: number;
  goal: number;
}

const GameInfo: React.FC<GameInfoProps> = ({ score, bestScore, level, goal }) => {
  return (
    <View style={styles.gameInfo}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Best</Text>
        <Text style={styles.scoreValue}>{bestScore}</Text>
      </View>

      <View style={styles.levelContainer}>
        <Text style={styles.levelLabel}>Level {level}</Text>
        <Text style={styles.goalLabel}>Goal: {goal}</Text>
      </View>
    </View>
  );
};

export default GameInfo;


