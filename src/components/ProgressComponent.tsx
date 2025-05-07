import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface ProgressComponentProps {
  score: number;
  bestScore: number;
  goal: number;
}

const ProgressComponent: React.FC<ProgressComponentProps> = ({ score, bestScore, goal }) => {
  // Calculate progress percentage between goal/2 and goal (capped at 0-100%)
  const progressPercentage = Math.min(Math.max(((goal/2) / (goal)) * 100, 0), 100);

  return (
    <View style={styles.container}>
      {/* Left: Highest */}
      <View style={styles.labelBox}>
        <Text style={styles.label}>Highest</Text>
        <View style={styles.miniContainer}>
          <Image
            source={require('../assets/images/mini_trophy.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.value}>{goal/2}</Text>
        </View>
      </View>
      
      {/* Center: Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.barContainer}>
          {/* Progress Fill */}
          <View 
            style={[
              styles.barFill, 
              { width: `${progressPercentage}%` }
            ]} 
          />
          
          {/* Score Marker */}
          <View 
            style={[
              styles.marker, 
              { left: `${progressPercentage}%` }
            ]} 
          />
        </View>
      
      </View>
      
      {/* Right: Aim */}
      <View style={styles.labelBox}>
        <Text style={styles.label}>Aim</Text>
        <View style={styles.miniContainer}>
          <Image
            source={require('../assets/images/mini_jackpot.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.value}>{goal}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProgressComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '105%',
  },
  labelBox: {
    alignItems: 'center',
    width: 80,
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  label: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  value: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  progressSection: {
    flex: 1,
    alignItems: 'center',
   
  },
  barContainer: {
    height: 6,
    backgroundColor: '#ff69b4',
    width: '110%',
    borderRadius: 3,
    position: 'relative',
    marginBottom: -10,
  },
  barFill: {
    position: 'absolute',
    height: 6,
    backgroundColor: '#ff1493',
    borderRadius: 3,
  },
  marker: {
    position: 'absolute',
    top: -5,
    width: 16,
    height: 16,
    backgroundColor: '#ff1493',
    borderRadius: 8,
    borderWidth: 2,
    transform: [{ translateX: -8 }],
  },
  centerValue: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  miniContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1D3F',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 5,
    width: 70,
    height: 70,
    zIndex: 1,
  },
});