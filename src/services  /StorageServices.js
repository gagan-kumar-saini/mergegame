import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  async saveGameState(gameState) {
    try {
      const jsonValue = JSON.stringify(gameState);
      await AsyncStorage.setItem('@game_state', jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving game state:', error);
      return false;
    }
  }
  
  async loadGameState() {
    try {
      const jsonValue = await AsyncStorage.setItem('@game_state');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error loading game state:', error);
      return null;
    }
  }
  
  async saveSettings(settings) {
    try {
      const jsonValue = JSON.stringify(settings);
      await AsyncStorage.setItem('@settings', jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }
  
  async loadSettings() {
    try {
      const jsonValue = await AsyncStorage.getItem('@settings');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    }
    catch (error) {
      console.error('Error loading settings:', error);
      return null;
    }
    }
    async clearStorage() {
        try {
            await AsyncStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
        }
    }
    