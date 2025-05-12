import React, {  useEffect, useState,useCallback, use } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ImageBackground,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import { useFocusEffect } from '@react-navigation/native';
import {AdBanner} from '../components/AdBanner'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';  
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import {loadInterstitialAd, loadRewardedAd,} from '../utils/admobUtils';


const scale = Math.min(width, height) / 375; // Base scale on iPhone 8 width

const responsive = {
  size: (size: number) => Math.round(size * scale),
  width: (percentage: number) => width * (percentage / 100),
  height: (percentage: number) => height * (percentage / 100),
};

// Create responsive padding based on screen size
const basePadding = width * 0.05;

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
      
     
      <ImageBackground 
        source={require('../assets/images/bg-pattern.png')} 
        style={styles.backgroundPattern}
        resizeMode="cover"
      >
       
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
                <Text style= {styles.highScoreText}>{bestScore}</Text>
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
         <View style={styles.bannerContainer}>
          <AdBanner adUnitId={'ca-app-pub-5686269557208989/6455784018'} />
        </View>
      </ImageBackground>
      
    </View>
  );
};


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
   bannerContainer: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    backgroundColor: 'transparent', // optional
    paddingBottom: 5,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: basePadding,
    paddingTop: Platform.OS === 'ios' ? responsive.size(50) : responsive.size(20),
    marginBottom: responsive.size(30),
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starIcon: {
    width: responsive.size(30),
    height: responsive.size(30),
    marginRight: responsive.size(8),
  },
  scoreText: {
    color: 'white',
    fontSize: responsive.size(22),
    fontWeight: 'bold',
  },
  highScoreText: {
    fontSize: responsive.size(26),
    fontWeight: 'bold',
  },
  cubeIcon: {
    width: responsive.size(60),
    height: responsive.size(60),
    marginLeft: responsive.size(-35),
  },
  settingsButton: {
    padding: responsive.size(5),
  },
  settingsIcon: {
    width: responsive.size(30),
    height: responsive.size(30),
  },
  plusIcon: {
    width: responsive.size(20),
    height: responsive.size(20),
    marginLeft: responsive.size(5),
  },
  highScoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: responsive.width(80),
    height: responsive.height(35),
    marginTop: responsive.size(100),
  },
  bannerWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  highScoreLabel: {
    color: 'white',
    fontSize: responsive.size(24),
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scoreBoard: {
    backgroundColor: '#E0CDB2',
    width: '95%',
    height: '85%',
    marginTop: responsive.size(-15),
    borderRadius: responsive.size(15),
    padding: responsive.size(20),
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
    marginTop: responsive.size(50),
    width: '100%',
    justifyContent: 'center',
  },
  trophyIcon: {
    width: responsive.size(100),
    height: responsive.size(100),
    resizeMode: 'contain',
  },
  scoreValueContainer: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: responsive.size(30),
    fontFamily: Platform.select({
      ios: 'Poltawski-Nowy',
      android: 'Poltawski-Nowy',
      default: 'System'
    }),
    fontWeight: 'bold',
  },
  playButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: responsive.height(10),
    width: responsive.width(70),
    height: responsive.size(80),
    borderRadius: responsive.size(10),
    overflow: 'hidden',
    shadowRadius: 3,
  },
  playButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsive.size(10),
  },
  playButtonText: {
    color: 'white',
    fontSize: responsive.size(24),
    fontWeight: 'bold',
    marginRight: responsive.size(10),
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  playArrow: {
    width: responsive.size(24),
    height: responsive.size(24),
    tintColor: 'white',
  },
});

export default HomeScreen;