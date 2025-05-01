import React from 'react';
import { View, Text } from 'react-native';
import { useGameContext } from '../context/GameContext';

interface HeaderProps {
  onReset: () => void; // still required if passed by parent, but unused now
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
  const { state } = useGameContext();
  const { score, bestScore, gems, level, goal } = state;

  return (
    <View>
      <View style={gameStyles.header}>
        <View style={gameStyles.scoreContainer}>
          <View style={gameStyles.scoreBox}>
            <Text style={gameStyles.scoreLabel}>SCORE</Text>
            <Text style={gameStyles.scoreValue}>{score}</Text>
          </View>
          <View style={gameStyles.scoreBox}>
            <Text style={gameStyles.scoreLabel}>BEST</Text>
            <Text style={gameStyles.scoreValue}>{bestScore}</Text>
          </View>
          <View style={gameStyles.gemBox}>
            <Text style={gameStyles.gemIcon}>💎</Text>
            <Text style={gameStyles.gemValue}>{gems}</Text>
          </View>
        </View>
      </View>

      <View style={gameStyles.header}>
        <View>
          <Text style={gameStyles.subtitle}>Level: {level}</Text>
          <Text style={gameStyles.subtitle}>Goal: {goal}</Text>
        </View>
      </View>
    </View>
  );
};

// Styles remain unchanged
const gameStyles = {
  header: {
    flexDirection: 'row' as const,
    justifyContent: "center" as const,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    height: 80
  },
  titleContainer: {
    flexDirection: 'column' as const,
    justifyContent: "center" as const
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 10,
    textAlign: 'center' as const,
    flex: 1
  },
  scoreContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-around' as const,
    flex: 1
  },
  scoreBox: {
    marginHorizontal: 10,
    flex: 1,
    alignItems: 'center' as const
  },
  scoreLabel: {
    fontSize: 12,
    color: '#999'
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold' as const
  },
  gemBox: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center' as const
  },
  gemIcon: {
    fontSize: 20
  },
  gemValue: {
    fontSize: 20,
    marginLeft: 5
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold' as const
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    flex: 1,
    alignItems: 'center' as const
  }
};

export default Header;
