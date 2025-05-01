import React from 'react';
import { StatusBar } from 'react-native';
import { GameProvider } from './context/GameContext';
import GameScreen from './screens/GameScreen';

const App: React.FC = () => {
  return (
    <GameProvider>
      <StatusBar backgroundColor="#faf8ef" barStyle="dark-content" />
      <GameScreen />
    </GameProvider>
  );
};

export default App;