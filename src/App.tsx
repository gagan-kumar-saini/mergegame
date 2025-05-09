import React from 'react';
import AppNavigator from '../src/navigation/AppNavigator';
import { loadInterstitialAd } from './utils/admobUtils';

loadInterstitialAd(); 


const App = () => {
  return <AppNavigator />;
};

export default App;