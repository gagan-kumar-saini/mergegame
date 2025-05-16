import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';

interface PausePopupProps {
  score: number;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  onClaim: () => void;
}

const PausePopup: React.FC<PausePopupProps> = ({
  score,
  onResume,
  onRestart,
  onHome,
  onClaim,
}) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/images/popup_background.png')}
          resizeMode="contain"
          style={styles.backgroundImage}
        
        >
        <Text style={styles.title}>Take a breather. Your progress is safe.</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onResume}>
            <Image
              source={require('../assets/images/cross_png.png')}
              style={styles.cross}
            />
          </TouchableOpacity>
          
          <View style={styles.content}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Paused</Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={onResume}>
                <Text style={styles.buttonText}>RESUME</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.button} onPress={onRestart}>
                <Text style={styles.buttonText}>RESTART</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.button} onPress={onHome}>
                <Text style={styles.buttonText}>HOME</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.button, styles.claimButton]} onPress={onClaim}>
                <Text style={[styles.buttonText, styles.claimButtonText]}>CLAIM REWARD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  container: {
    position: 'relative',
    width: '80%',
    maxWidth: 320,
    aspectRatio: 0.8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cross: {
    width: 50,
    height: 50,
    marginTop: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreContainer: {
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  scoreLabel: {
    marginTop: -50,
    fontSize: 22,
    color: '#FFF',
    fontWeight: 'bold',
  },
  scoreValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  claimButton: {
    backgroundColor: '#FFD700',
    marginTop: 5,
  },
  claimButtonText: {
    color: '#333',
  },
});

export default PausePopup;