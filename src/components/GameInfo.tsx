import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ProgressComponent from './ProgressComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface GameInfoProps {
  score: number;
  bestScore: number;
  level: number;
  goal: number;
}


const GameInfo: React.FC<GameInfoProps> = ({ score, bestScore, level, goal }) => {
  return (
    <View>
      <View style={styles.container}>
      {/* Star + Points */}
      <View style={styles.item}>
        <Image
          source={require('../assets/images/star_png.png')}
          resizeMode="contain"
        />
        <Text style={styles.text}>120</Text>
        <Image
          source={require('../assets/images/plus_icon.png')}
          resizeMode="contain"
        />
      </View>

      {/* Level */}
      <View style={[styles.item, styles.levelItem]}>
      <Image
          source={require('../assets/images/level_icon.png')}
          resizeMode="contain"
        />
        <Text style={styles.levelText}>Lv. - {level}</Text>
      </View>

      {/* Settings */}
      <View style={styles.item}>
      <Image
          source={require('../assets/images/settings.png')}
          resizeMode="contain"
        />
      </View>
      </View>
      <View style={styles.progress}>
       <ProgressComponent 
       score={score}
        bestScore={bestScore}
        goal={goal}/>
        
     
        </View>
    </View>
   
  );
};

export default GameInfo;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  text: {
    color: 'white',
    marginHorizontal: 4,
    fontWeight: 'bold',
  },
  levelItem: {
    marginLeft: -20,
  },
  levelText: {
    color: 'white',
    marginLeft: 4,
    backgroundColor: '#1A1D3F',
    padding: 4,
    borderRadius: 5,
    fontWeight: 'bold',
  },
  progress: {
    marginTop: 20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  }
}
);


