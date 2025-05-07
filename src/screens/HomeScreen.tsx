import React, { use, useEffect, useState,useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ImageBackground,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';  
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [bestScore, setBestScore] = useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide(); // Hide the splash screen after 2 seconds
    }, 1000);
    }, []);

  useFocusEffect(
    useCallback(() => {
      getHighScore();
    }, [])
  );
  
  const getHighScore = async () => {
    try {
      const value = await AsyncStorage.getItem('goal');
      if (value !== null) {
        setBestScore(parseInt(value));
      } else {
        setBestScore(0);
      }
      return value !== null ? parseInt(value) : 16;
    } catch (error) {
      console.error('Error retrieving high score:', error);
      return 0;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background with floating squares */}
      <ImageBackground 
        source={require('../assets/images/bg-pattern.png')} 
        style={styles.backgroundPattern}
        resizeMode="cover"
      >
        {/* Top bar with star score and settings */}
        <View style={styles.topBar}>
          <View style={styles.scoreContainer}>
            <Image 
              source={require('../assets/images/star_png.png')}
              resizeMode="contain" 
              style={styles.starIcon} 
            />
            <Text style={styles.scoreText}>50</Text>
            <Image 
              source={require('../assets/images/plus_icon.png')}
              style={styles.plusIcon} 
            />

          </View>
          
          <Image 
            source={require('../assets/images/cube_icon.png')} 
            style={styles.cubeIcon} 
          />
          
          <TouchableOpacity style={styles.settingsButton}>
            <Image 
             source={require('../assets/images/settings.png')} 
              style={styles.settingsIcon} 
            />
          </TouchableOpacity>
        </View>
        
        {/* High Score Section with Background Image */}
        <View style={styles.highScoreContainer}>
          <ImageBackground 
            source={require('../assets/images/high_score_png.png')} 
            style={styles.bannerWrapper}
            resizeMode="cover"
          >
            <View style={styles.trophySection}>
              <Image 
              source={require('../assets/images/trophy_png.png')} 
              style={styles.trophyIcon}
              />
                <View style={styles.scoreValueContainer}>
                <Text style= {styles.scoreText}>{bestScore}</Text>
                </View>
            </View>
          </ImageBackground>
        </View>
        {/* Play Button */}
        <TouchableOpacity 
          style={styles.playButtonContainer}
          onPress={() => navigation.navigate('GameBoard')}
        >
      <Image
        source={require('../assets/images/play_button.png')}
        style={styles.playButton}
      resizeMode="contain"
      />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1F35',
  },
  backgroundPattern: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 5,
    marginBottom: 40,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },
  starIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  scoreText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  cubeIcon: {
    width: 60,
    height: 60,
    marginLeft: -35,
  },
  settingsButton: {
    padding: 5,
  },
  settingsIcon: {
    width: 30,
    height: 30,
  },
  plusIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  highScoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.8,
    height: height * 0.35,
    marginTop: 100,
  },
  bannerWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  
  highScoreLabel: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scoreBoard: {
    backgroundColor: '#E0CDB2',
    width: '95%',
    height: '85%',
    marginTop: -15,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#C0AB8E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  trophySection: {
    alignItems: 'center',
    marginTop: 50,
    width: '100%',
    justifyContent: 'center',
  },
  trophyIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  scoreValueContainer: {
  },
  scoreValue: {
    fontSize: 30,
    fontFamily: 'Poltawski-Nowy',
    fontWeight: 'bold',
  },
  playButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: height * 0.1,
    width: width * 0.7,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    shadowRadius: 3,
  },
  playButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  playButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  playArrow: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});

export default HomeScreen;